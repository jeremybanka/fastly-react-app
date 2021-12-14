import { belongsTo, hasMany, Model } from 'ember-cli-mirage'

export default Model.extend({
  userGroups: hasMany('user-group'),
  customer: belongsTo(),
  services: hasMany('service'),
})
