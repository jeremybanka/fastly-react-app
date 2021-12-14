import JSONAPISerializer from '@ember-data/serializer/json-api'

export default class AccountSerializer extends JSONAPISerializer {
  keyForAttribute(key) {
    return key
  }
}
