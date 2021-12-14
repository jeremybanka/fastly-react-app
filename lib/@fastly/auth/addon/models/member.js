import { attr, hasMany } from '@ember-data/model'
import IamBaseModel from '@fastly/auth/models/iam-base-model'
import { setOwner } from '@ember/application'

export default class MemberModel extends IamBaseModel {
  constructor(owner, args) {
    super(owner, args)
    setOwner(owner)
    this.memberType = this.constructor.modelName
  }

  @attr('string') login
  @attr('string') name

  // Relationships
  // ---------------------------------------------------------------------------
  @hasMany('user-group') userGroups
}
