import { attr, belongsTo, hasMany } from '@ember-data/model'
import IamBaseModel from '@fastly/auth/models/iam-base-model'

export default class IamRoleModel extends IamBaseModel {
  // Atrributes
  // ---------------------------------------------------------------------------
  @attr('string') customer_id
  @attr('string') name
  @attr('string') description
  @attr('boolean', { defaultValue: true }) custom
  @attr('number') permissions_count

  // Relationships
  // ---------------------------------------------------------------------------
  @belongsTo('customer') customer

  @hasMany('permission') permissions
  @hasMany('user-group') userGroups
}
