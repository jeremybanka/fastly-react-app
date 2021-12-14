import { attr, hasMany } from '@ember-data/model'
import IamBaseModel from '@fastly/auth/models/iam-base-model'

export default class UserGroupModel extends IamBaseModel {
  // Attributes
  // ---------------------------------------------------------------------------
  @attr('string') name
  @attr('string') description
  @attr('number') users_count
  @attr('number') invitations_count

  // Relationships
  // ---------------------------------------------------------------------------
  @hasMany('member', { polymorphic: true }) members
  @hasMany('service-group') serviceGroups
  @hasMany('role') roles
}
