import { belongsTo, hasMany, Model } from 'ember-cli-mirage'

export default Model.extend({
  permissions: hasMany(),
  userGroups: hasMany(),
  customer: belongsTo(),
})
