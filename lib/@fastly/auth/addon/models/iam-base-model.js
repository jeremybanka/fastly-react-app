import Model, { attr } from '@ember-data/model'
import { PrimarySaveError, RelationshipSaveError } from '@fastly/auth/utils/errors'
import { debug } from '@ember/debug'
import { singularize } from 'ember-inflector'
import { tracked } from '@glimmer/tracking'

export default class IamBaseModel extends Model {
  /**
   * Stores the status of each relationship save performed
   *
   * Will be set to the result of a Promise.allSettled() response
   *
   * [
   *  {
   *    status: 'fulfilled',
   *    response: Object
   *  },
   *  {
   *    status: 'rejected',
   *    reason: Object
   *  }
   * ]
   *
   */
  @attr() relationshipStatuses

  /**
   * Stores the error if PATCHing the record fails (updateRecord only)
   *
   * Will be set to the error caught from the AJAX call
   */
  @attr() primarySaveError

  @attr('date') created_at
  @attr('date') updated_at

  @tracked
  _relationshipTracker = {}

  relationshipTrackerVersion = {}

  get hasDirtyRelationships() {
    return Object.values(this._relationshipTracker).length > 0
  }

  // Custom toJSON implementation to satisfy following deprecation
  // https://deprecations.emberjs.com/ember-data/v3.x/#toc_record-toJSON
  toJSON() {
    return this.serialize({ includeId: true })
  }

  setRelationship(relationshipName, value) {
    if (isRelationship(this, relationshipName)) {
      this._relationshipTracker[relationshipName] =
        this._relationshipTracker[relationshipName] || []
      const entry = this._relationshipTracker[relationshipName]
      if (Object.values(entry).length === 0) {
        const version = this.relationshipTrackerVersion[relationshipName] || 0
        this.relationshipTrackerVersion[relationshipName] = version + 1
        entry[version] = currentState(this, relationshipName)
      }
      this[relationshipName] = value
    }
  }

  updateRelationshipTracker(options) {
    if (options.updateRelationships) {
      options.updateRelationships.forEach((field) => {
        let entry = this._relationshipTracker[field]
        if (!entry) {
          entry = this._relationshipTracker[field] = {}
        }
        const version = this.relationshipTrackerVersion[field] || 0
        this.relationshipTrackerVersion[field] = version + 1
        if (!(version in entry)) {
          entry[version] = currentState(this, field)
        }
      })
    }
  }

  rollbackRelationship(relationship) {
    if (isRelationship(this, relationship)) {
      const [lastRelationshipState] = this._relationshipTracker[relationship].slice(-1)
      this[relationship] = lastRelationshipState
    }
  }

  rollbackAllRelationships() {
    Object.keys(this._relationshipTracker).forEach((relationship) =>
      this.rollbackRelationship(relationship)
    )
  }

  async save(options = {}) {
    let adapterOptions = {}
    if (options.update) {
      const updateRelationships = options.update.filter((relationshipName) =>
        isRelationship(this, relationshipName)
      )
      adapterOptions = {
        updateRelationships,
      }
    }
    const response = await super.save({ adapterOptions })

    const failedRelationshipErrors = _processRelationshipSaveStatuses(this, response)

    if (response.primarySaveError) {
      throw new PrimarySaveError(response.id, response.primarySaveError, failedRelationshipErrors)
    } else if (failedRelationshipErrors.length) {
      throw new RelationshipSaveError(response.id, failedRelationshipErrors)
    }

    delete response.relationshipStatuses
    delete response.primarySaveError

    this.updateRelationshipTracker(adapterOptions)
    return response
  }

  /**
   * loadAllRelated - by default, the iam service returns only the first 20 results
   * in an array response, and it will not send more than 100 results. In the
   * instance that we need all of the related records, this function will trigger
   * a reload of the relationship and tell the adapter to iteratively fetch all
   * the pages this time, then it will return the new contents of the relationship.
   *
   * @param {string} relationship - the plural name of the relationship
   */
  loadAllRelated(relationship) {
    const relationshipDef = this.relationshipFor(relationship)
    relationshipDef.options.fetchAllPages = true
    return this[relationship].reload()
  }
}

function _processRelationshipSaveStatuses(model, response) {
  const relationshipStatuses = response.relationshipStatuses
  if (!relationshipStatuses) return []
  // gather rejected statuses
  const rejected = relationshipStatuses.filter(({ status }) => status === 'rejected')
  // revert what had been changed
  rejected.forEach(({ reason: error }) => {
    const { relationship, method, data } = error
    const dataIds = data[relationship].map(({ id }) => id)
    // start with the current relationship
    let newStateOfRelationship = currentState(model, relationship)
    if (method === 'POST') {
      // remove records that failed POST
      newStateOfRelationship = newStateOfRelationship.filter(
        (record) => !dataIds.includes(record.id)
      )
    } else {
      // add records that failed DELETE
      const dataToAddBack = data[relationship].map((record) => {
        return model.store.peekRecord(singularize(relationship), record.id)
      })
      newStateOfRelationship = [...newStateOfRelationship, ...dataToAddBack]
    }
    model[relationship] = newStateOfRelationship
  })
  return rejected.map(({ reason: error }) => error)
}

function isRelationship(model, relationshipName) {
  if (model.constructor.relationshipsByName.get(relationshipName)) {
    return true
  } else {
    debug(`Relationship ${relationshipName} does not exist on Model ${model.modelName}`)
    return false
  }
}

function currentState(model, field) {
  let config = model.constructor.relationshipsByName.get(field)
  if (config.kind === 'hasMany') {
    let reference = model.hasMany(field)
    let refValue = reference.value()
    return refValue ? refValue.toArray() : []
  } else {
    let reference = model.belongsTo(field)
    return reference.value()
  }
}
