import { InvalidError } from 'ember-ajax/errors'
import JSONAPIAdapter from '@ember-data/adapter/json-api'
import { PrimarySaveError } from '../utils/errors'
import { underscore } from '@ember/string'

export default class IamBaseAdapter extends JSONAPIAdapter {
  constructor(owner) {
    super(...arguments)
    const { APP: config } = owner.resolveRegistration('config:environment')
    this.host = config.apiURL || ''
    const session = owner.lookup('service:session')
    const { headers } = session._session.addHeaders({})
    this.headers = headers
  }

  /**
   * Override base adapters isInvalid method to also mark 400 as an invalid request error
   *
   * @param {Number} status Status code returned from response
   * @returns {Boolean} Whether or not the response indicates an invalid (bad) request
   */
  isInvalid(status) {
    return super.isInvalid(...arguments) || status === 400
  }

  /**
   * Override base adapters handleResponse method to properly send the payload,
   * rather than the default `payload.errors` to `new InvalidError`
   *
   * @param  {Number} status
   * @param  {Object} headers
   * @param  {Object} payload
   * @return {Object | DS.AdapterError} response
   */
  handleResponse(status, headers, payload) {
    if (this.isInvalid(status, headers, payload)) {
      return new InvalidError(payload)
    }

    return super.handleResponse(...arguments)
  }

  /**
   *
   * This compares relationship changes to the initial state of the relationship if we know it.
   * An array of the records that need to be handled will be returned. Records will be in one of two objects
   * ```
   * [
   *  {
   *    method: 'POST',
   *    data: { ... }
   *  },
   *  {
   *    method: 'DELETE',
   *    data: { ... }
   *  }
   * ]
   * ```
   * If the initial state is unknown ther return will be an array with a single object with a method of POST
   *
   * @param {Snapshot} snapshot - representation of the model being handled
   * @param {Serializer} serializer  - the serializer for the model type being handled
   * @param {String} relationship  - the name of the relationship being handled
   * @returns {Array}
   */
  serializeRelationshipRequests(snapshot, serializer, relationship) {
    const relationshipData = {}
    serializer.serializeHasMany(
      snapshot,
      relationshipData,
      snapshot.record.relationshipFor(relationship)
    )
    const relationshipStates = Object.values(
      snapshot.record._relationshipTracker[relationship] || {}
    )
    // If we have an initial value (and the record is not new) we need to determine what changes are being made and how to handle
    // additions are POST
    // removals are DELETE
    if (relationshipStates.length && !snapshot.record.isNew) {
      const [lastRelationshipState] = relationshipStates.slice(-1)
      const initialState = lastRelationshipState.map(({ id }) => id)
      const relationshipItems = Object.values(relationshipData[relationship])
      const itemsToPost = relationshipItems.filter((item) => !initialState.includes(item.id))
      const methodData = []
      const underscoredRelationship = underscore(relationship)
      if (itemsToPost.length) {
        methodData.push({
          method: 'POST',
          data: {
            [underscoredRelationship]: itemsToPost,
          },
        })
      }

      const itemsToDelete = initialState.reduce((acc, itemId) => {
        if (!relationshipItems.find(({ id }) => id === itemId)) {
          const itemMarkedForDeletion = lastRelationshipState.find(({ id }) => id === itemId)
          return [...acc, this._itemMarkedForDeletionJSON(itemMarkedForDeletion)]
        }
        return acc
      }, [])

      if (itemsToDelete.length) {
        methodData.push({
          method: 'DELETE',
          data: {
            [underscoredRelationship]: itemsToDelete,
          },
        })
      }

      return methodData
    } else {
      // If we do not have an initial state (or the record is new) this must be for a new record or we are not tracking the relationship
      return [
        {
          method: 'POST',
          data: relationshipData,
        },
      ]
    }
  }

  /**
   * Override this method to add `object: <modelName>` for polymorphic relationships
   *
   * @param {itemMarkedForDeletion} { id }
   * @returns JSON to be sent on the DELETE request
   */
  _itemMarkedForDeletionJSON({ id }) {
    return { id }
  }

  /**
   *
   * @param {Model} record
   * @param {Snapshot} snapshot
   * @param {Serializer} serializer
   * @returns
   */
  handleRelationships(record, snapshot, serializer) {
    let {
      adapterOptions: { updateRelationships },
    } = snapshot
    const relationshipPromises = []
    if (updateRelationships?.length) {
      updateRelationships.forEach((relationship) => {
        // overrides the serializer attr object to ensure we get the permissions back
        snapshot._overrideAttrsArray = true
        const relationshipRequests = this.serializeRelationshipRequests(
          snapshot,
          serializer,
          relationship
        )
        relationshipRequests.forEach(({ method, data }) => {
          const link = record[relationship].links.related
          relationshipPromises.push(
            this.ajax(link, method, { data }).catch((error) => {
              error.relationship = relationship
              error.parentId = record.id
              error.link = link
              error.method = method
              error.data = data
              throw error
            })
          )
        })
      })
    }
    return relationshipPromises
  }

  async createRecord(store, type, snapshot) {
    const serializer = store.serializerFor(type.modelName)
    const data = serializer.serialize(snapshot)
    let { id } = snapshot
    const baseUrl = this.buildURL(type.modelName, id, snapshot, 'createRecord')
    return new Promise((resolve, reject) => {
      this.ajax(baseUrl, 'POST', { data })
        .then((data) => {
          Promise.allSettled(
            this.handleRelationships(
              serializer.serializeRecord(data).relationships,
              snapshot,
              serializer
            )
          ).then((relationshipStatuses) => {
            data.relationshipStatuses = relationshipStatuses
            resolve(data)
          })
        })
        .catch((e) => reject(new PrimarySaveError(id, e, [])))
    })
  }

  async updateRecord(store, type, snapshot) {
    const serializer = store.serializerFor(type.modelName)
    let data = serializer.serialize(snapshot)
    let { id } = snapshot
    const baseUrl = this.buildURL(type.modelName, id, snapshot, 'updateRecord')
    if (Object.keys(snapshot.record.changedAttributes()).length) {
      try {
        const response = await this.ajax(baseUrl, 'PATCH', { data })
        data = response
      } catch (error) {
        data.primarySaveError = error
      }
    }
    data.relationshipStatuses = await Promise.allSettled(
      this.handleRelationships(snapshot.record, snapshot, serializer)
    )
    return new Promise((resolve) => resolve(data))
  }

  findHasMany(store, snapshot, url, relationship) {
    let id = snapshot.id
    let type = snapshot.modelName

    url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'))

    if (relationship.options.fetchAllPages) {
      delete relationship.options.fetchAllPages
      return _getAllPages(this, url)
    }

    return this.ajax(url, 'GET')
  }
}

function _getAllPages(adapter, url) {
  return _getPage(adapter, url, 1).then((response) => {
    const {
      data,
      meta: { total_pages },
    } = response
    const remainingPages = Array.from({ length: total_pages - 1 }, (v, k) => k + 2)
    const pagePromises = remainingPages.map((pageNum) => _getPage(adapter, url, pageNum))

    return Promise.all(pagePromises).then((responses) => {
      return { data: responses.reduce((acc, response) => acc.concat(response.data), data) }
    })
  })
}

function _getPage(adapter, url, page) {
  const options = {
    data: {
      page,
      per_page: 100,
    },
  }
  return adapter.ajax(url, 'GET', options)
}
