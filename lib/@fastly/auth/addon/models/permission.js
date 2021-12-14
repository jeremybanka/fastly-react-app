import { attr } from '@ember-data/model'
import IamBaseModel from '@fastly/auth/models/iam-base-model'

export default class PermissionModel extends IamBaseModel {
  // Attributes
  // ---------------------------------------------------------------------------
  @attr('string') name
  @attr('string') resource_name
  @attr('string') resource_description
  @attr('string') operation
  @attr('string') description
  @attr('string') scope
}
