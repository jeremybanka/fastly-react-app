import { attr, belongsTo, hasMany } from '@ember-data/model'
import IamBaseModel from '@fastly/auth/models/iam-base-model'

export default class ServiceGroupModel extends IamBaseModel {
  // Attributes
  // ---------------------------------------------------------------------------
  @attr('string') name
  @attr('string') description
  @attr('string') customer_id
  @attr('date') createdAt
  @attr('date') updatedAt
  @attr('number') services_count

  // Relationships
  // ---------------------------------------------------------------------------
  @hasMany('user-group') userGroups
  @hasMany('service') services
  @belongsTo('customer') customer
}
