import Model, { attr, belongsTo, hasMany } from '@ember-data/model'

export default Model.extend({
  accessToken: attr('string'),
  createdAt: attr('date'),
  customer: belongsTo('customer'),
  expiresAt: attr('date'),
  lastUsedAt: attr('date'),
  name: attr('string'),
  services: hasMany('services'),
  scopes: attr('camelized-object'),
  user: belongsTo('user'),
})
