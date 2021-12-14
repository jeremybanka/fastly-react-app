import { hasMany, Model } from 'ember-cli-mirage'

export default Model.extend({
  members: hasMany('member', { polymorphic: true }),
  roles: hasMany(),
  serviceGroups: hasMany(),
})
