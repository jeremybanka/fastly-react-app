import { camelize } from '@ember/string'
import JSONAPISerializer from '@ember-data/serializer/json'

export default class IamBaseSerializer extends JSONAPISerializer {
  attrs = {
    primarySaveError: { serialize: false },
    relationshipStatuses: { serialize: false },
    updated_at: { serialize: false },
    created_at: { serialize: false },
  }

  constructor(owner) {
    super(...arguments)
    const { APP: config } = owner.resolveRegistration('config:environment')
    this.host = config.apiURL || ''
  }

  /**
   * The links returned from the API may be relative and not include the API origin ()`this.host`)
   * this function will set the host to `this.host` if the link does not include one
   *
   * @param {string} link - link provided by the API, potentially relative
   * @returns {string} absolute url
   */
  maybeAddHost(link) {
    const url = new URL(link, this.host) // default functionality is to add host only if there is none provided
    // TODO? should we throw if host of `url` does not match `this.host`?
    return url.toString()
  }

  serializeRecord(record) {
    const { id, object, _links, ...attributes } = record
    const serializedResponse = {
      id,
      type: object,
      attributes: { ...attributes, id },
    }
    if (_links) {
      const relationships = Object.entries(_links).map((entry) => {
        const [key, link] = entry
        return [
          camelize(key),
          {
            links: {
              related: this.maybeAddHost(link),
            },
          },
        ]
      })
      serializedResponse.relationships = Object.fromEntries(relationships)
    }
    return serializedResponse
  }

  normalizeArrayResponse(store, primaryModelClass, payload) {
    return {
      data: [...payload.data.map(this.serializeRecord.bind(this))],
    }
  }

  normalizeSingleResponse(store, primaryModelClass, payload) {
    return { data: this.serializeRecord(payload) }
  }

  // mostly taken from json api serializeHasMany
  serializeHasMany(snapshot, json, relationship) {
    const key = relationship.key
    const isPolymorphic = relationship.options?.polymorphic || false
    if (snapshot._overrideAttrsArray || this.shouldSerializeHasMany(snapshot, key, relationship)) {
      const hasMany = snapshot.hasMany(key)
      if (hasMany !== undefined) {
        let payloadKey = this._getMappedKey(key, snapshot.type)
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize')
        }
        // only serialize has many relationships that are not new
        const nonNewHasMany = hasMany.filter((item) => item.record && !item.record.get('isNew'))
        const data = new Array(nonNewHasMany.length)

        for (let i = 0; i < nonNewHasMany.length; i++) {
          data[i] = {
            id: nonNewHasMany[i].id,
          }
          if (isPolymorphic) {
            data[i].object = nonNewHasMany[i].modelName
          }
        }

        json[payloadKey] = data
      }
    }
  }
}
