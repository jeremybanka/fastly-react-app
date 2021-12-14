import { dasherize, underscore } from '@ember/string'
import { JSONAPISerializer } from 'ember-cli-mirage'
import { pluralize } from 'ember-inflector'

function _paginate(json, request) {
  const pageNumber = parseInt(request.queryParams['page']) || 1
  const pageSize = parseInt(request.queryParams['per_page']) || 20

  const minIndex = (pageNumber - 1) * pageSize
  const maxIndex = pageNumber * pageSize
  const totalRecords = json.data.length
  json.data = json.data.slice(minIndex, maxIndex)
  json.meta = json.meta || {}
  json.meta.current_page = pageNumber
  json.meta.per_page = pageSize
  json.meta.record_count = totalRecords
  json.meta.total_pages = json.meta.total_pages || Math.ceil(totalRecords / pageSize)
  return json
}

export default JSONAPISerializer.extend({
  apiOrigin: null,
  constructor({ request }) {
    if (request.url && !this.apiOrigin) {
      this.apiOrigin = new URL(request.url).origin
    }
  },
  alwaysIncludeLinkageData: true,
  typeKeyForModel({ modelName }) {
    return modelName
  },
  keyForAttribute(attribute) {
    return underscore(attribute)
  },
  keyForRelationship(relationship) {
    return underscore(relationship)
  },
  serialize(object, request, options = { paginate: true }) {
    const jsonApiResponse = JSONAPISerializer.prototype.serialize.apply(this, arguments)
    if (Array.isArray(jsonApiResponse.data)) {
      const processed = {
        data: jsonApiResponse.data.map((record, index) =>
          this._serializeRecord(record, object.models[index])
        ),
      }

      return options.paginate ? _paginate(processed, request) : processed
    } else {
      return this._serializeRecord(jsonApiResponse.data, object)
    }
  },

  /**
   * Converts the response to match Fastly V3 API Style Guide
   *
   * @param {*} record
   * @param {Child} object
   * @returns {Object}
   */
  _serializeRecord(record, object) {
    const { attributes, type, id } = record
    const serializedResponse = {
      ...attributes,
      object: type,
      id,
      _links: this._getLinks(object),
      ...this._addCounts(object),
    }
    return serializedResponse
  },

  _addCounts(object) {
    const counts = Object.entries(object.associations)
      .map((entry) => {
        const [relationship, association] = entry
        if (association.type === 'hasMany') {
          return [`${relationship}_count`, object[relationship] ? object[relationship].length : 0]
        }
      })
      .filter((count) => count)
    return Object.fromEntries(counts)
  },

  /**
   * Takes a model (object) and spits out the links hash
   *
   * @param {Child|Collection} object - Contains the information about the relationships
   * @returns {Object} - {
   *  permissions: 'https://api.fastly.com/roles/x4xCwxxJxGCx123Rx5xTx/permissions
   *  members: 'https://api.fastly.com/user-groups/x4xCwxxJxGCx123Rx5xTx/members
   * }
   */
  _getLinks(object) {
    /**
     * CRUFT: this array contains relationships that do not align with API V3 styles
     * meaning that the url for these endpoints are not pluralized.
     *
     * Is there a better way to handle this?
     *
     * - Steve Heydweiller - June 10th, 2021
     */
    const relationshipsToNotPluralize = ['customer']
    const associations = Object.entries(object.associations).map((entry) => {
      const [key, association] = entry
      const {
        type: relationType,
        modelName: relationshipName,
        ownerModelName: relationshipOnModelName,
        name: relationshipCalledName,
        identifier: foreignKey,
      } = association
      const relationshipModelName =
        relationType === 'belongsTo' ? relationshipName : relationshipOnModelName
      const relationshipSegment = relationshipsToNotPluralize.includes(relationshipModelName)
        ? relationshipModelName
        : pluralize(relationshipModelName)
      if (relationType === 'belongsTo') {
        // example: roles/:role-id
        return [key, `${this.apiOrigin}/${relationshipSegment}/${object[underscore(foreignKey)]}`]
      } else if (relationType === 'hasMany') {
        return [
          key,
          // example: roles/:role-id/permissions
          `${this.apiOrigin}/${relationshipSegment}/${object.id}/${dasherize(
            pluralize(relationshipCalledName)
          )}`,
        ]
      }
    })
    return Object.fromEntries(associations)
  },
})
