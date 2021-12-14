import { attr, hasMany } from '@ember-data/model'

import MemberModel from './member'
import { inject as service } from '@ember/service'

export default class UserModel extends MemberModel {
  @service session

  @attr('date') createdAt
  @attr('string') emailHash
  @attr('boolean') limitServices
  @attr('boolean') locked
  @attr('string') login
  @attr('string') name
  @attr('boolean') requireNewPassword
  @attr('string') role
  @attr('boolean') twoFactorAuthEnabled
  @attr('date') updatedAt
  @attr('string') personaId
  @attr('date') adminRoleExpiresAt

  // Used when a SalesAdmin user has temporarily upped their role to admin
  @attr('date') adminRoleExpiresAt
  get isTemporaryAdmin() {
    return this.role === 'admin' && this.session._session.msExpiresIn(this.adminRoleExpiresAt) > 0
  }

  @hasMany('token') tokens
}
