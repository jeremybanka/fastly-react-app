import EmberObject, { computed, set } from '@ember/object'
import Session, { FASTLY_CUSTOMER_ID, SUDO_BUFFER } from '@fastly/auth/session'
import checkHeaders from '@fastly/auth/utils/check-headers'
import { getOwner } from '@ember/application'
import PermissionsCache from '@fastly/auth/permissions'
import RSVP from 'rsvp'
import { inject as service } from '@ember/service'
import Service from '@ember/service'
import { SsoRecommendedError } from '@fastly/auth/utils/errors'

export default Service.extend({
  // Public Properties
  // ---------------------------------------------------------------------------
  customer: readsPossiblyEmberDataModelFromSession('customer'),
  features: readsFromSession(),
  permissions: readsFromSession(),
  signedIn: readsFromSession(),
  sudoEnabled: readsFromSession(),
  sudoTimer: readsFromSession(),
  ssoLoginUrl: readsFromSession(),
  isInternalUser: readsFromSession(),
  user: readsPossiblyEmberDataModelFromSession('user'),

  // Internal Properties
  // ---------------------------------------------------------------------------
  router: service(),
  _session: computed(function () {
    const owner = getOwner(this)
    const config = owner.resolveRegistration('config:environment') || {}
    const fastlyAuthConfig = config['fastly-auth'] || {}
    const apiOrigin = fastlyAuthConfig.apiOrigin
    const authPath = fastlyAuthConfig.authPath
    const client = fastlyAuthConfig.client

    return new Session({ apiOrigin, authPath, client })
  }),
  _permissionCache: undefined,

  // track these params when the switch is interrupted by the need for otp.
  switchCustomerParams: undefined,

  // Override this property to tell the session where to reload the application
  // upon switching customer
  customerSwitchReturnTo: '/',

  // Public Methods
  // ---------------------------------------------------------------------------
  setToken(token) {
    this._session.token = token
  },

  ensureSession({ includeServices = false } = {}) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.signedIn) {
        return resolve(this)
      }
      this._session
        .ensureSession({ includeServices })
        .then(() => this._buildPermissionsCache())
        .then(() => {
          this._enableFeatureFlags()
          // Allow sudo to persist across browser reloads
          const { sudo_expires_at: tokenSudoExpiresAt = null } = this._session.token
          const { admin_role_expires_at: adminRoleExpiresAt = null } = this._session.user
          if (tokenSudoExpiresAt) {
            this.didEnableSudo(tokenSudoExpiresAt)
          }
          if (adminRoleExpiresAt) {
            this.setUpAdminRoleExpiration(adminRoleExpiresAt)
          }
          resolve(this)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  setUpAdminRoleExpiration() {
    const adminRoleExpiresAt = this._session.user.admin_role_expires_at
    const userRole = this._session.user.role
    const customerId = this.customer.id
    if (customerId !== FASTLY_CUSTOMER_ID || userRole !== 'admin') return
    const roleExpiresIn = this._session.msExpiresIn(adminRoleExpiresAt)
    const warningBuffer = SUDO_BUFFER * 10
    // setTimeout so we can run acceptance tests that make assertions _during_
    // sudo mode. If we used `Ember.run.later`, the test runner would block
    // until sudo mode expired.
    // See https://github.com/emberjs/ember.js/issues/3008
    setTimeout(() => {
      if (this.isDestroying || this.isDestroyed) return
      set(this, 'showAdminRoleExpirationWarning', true)
    }, roleExpiresIn - warningBuffer) // 5 minute warning
    setTimeout(() => {
      if (this.isDestroying || this.isDestroyed) return
      set(this, 'user.role', 'salesadmin')
      set(this, 'user.adminRoleExpiresAt', null)
    }, roleExpiresIn - SUDO_BUFFER) // 30 second expiration buffer
  },

  ajaxOptions(options) {
    const session = this._session
    return session == null ? options : session.addHeaders(options)
  },

  breakglassToAdmin(duration) {
    return this._session.breakglassToAdmin(duration).then(({ response }) => {
      this._session.user.admin_role_expires_at = response.admin_role_expires_at
      set(this, 'user.adminRoleExpiresAt', response.admin_role_expires_at)
      this.setUpAdminRoleExpiration()
    })
  },

  didEnableSudo(until) {
    this._session.didEnableSudo(until)
  },

  enableSudoPassword(password) {
    return new RSVP.Promise((resolve, reject) => {
      this._session
        .enableSudoPassword(password)
        .then(() => resolve(this))
        .catch(() => reject(this))
    })
  },

  enableSudoSaml() {
    return new RSVP.Promise((resolve, reject) => {
      this._session
        .enableSudoSaml()
        .then(() => resolve(this))
        .catch((error) => reject(error))
    })
  },

  signOut({ signOutOn401 = false, ssoLoginUrl = null } = {}) {
    const session = this._session
    if (!session.signedIn) {
      throw new Error('service:session cannot sign out; not signed in')
    }

    return new RSVP.Promise((resolve, reject) => {
      session
        .signOut({ signOutOn401, ssoLoginUrl })
        .then(() => {
          delete this._memoizedSessionProperties
          resolve(this)
        })
        .catch(() => {
          delete this._memoizedSessionProperties
          reject(this)
        })
    })
  },

  async switchAccount(customerId, options = {}) {
    options.returnTo =
      options.returnTo === undefined ? this.customerSwitchReturnTo : options.returnTo
    try {
      await this._session.switchAccount(customerId, options)
    } catch (err) {
      const header = checkHeaders(err)
      if (!options.otp && header === 'otp:required') {
        // We catch the error here if the request failed on missing otp
        set(this, 'switchCustomerParams', { customerId, options })
        this.router.transitionTo('switch-customer.two-factor-auth')
      } else if (!options.login && header === 'password:required') {
        // We catch the error here if the request failed on missing email amd password
        set(this, 'switchCustomerParams', { customerId, options })
        this.router.transitionTo('switch-customer.login-required')
      } else if (err instanceof SsoRecommendedError) {
        set(this, 'switchCustomerParams', { customerId, options })
        this.router.transitionTo('switch-customer.choose-auth-method')
      } else {
        console.error(err)
        // We throw the error to the template if otp or password are invalid
        throw err
      }
    } finally {
      delete this._memoizedSessionProperties
    }
  },

  sendToForgotPassword() {
    this._session.authPath = '/auth/forgot-password'
    this._session.ssoLoginUrl = null
    this.signOut()
  },

  getCustomerToken(customerId) {
    const { tokenStore } = this._session
    return tokenStore[customerId]
  },

  hasCustomerToken(customerId) {
    return Boolean(this.getCustomerToken(customerId))
  },

  isSaml() {
    const { token } = this._session
    return token.saml
  },

  getPermissionCache() {
    if (!this._permissionCache) {
      this._permissionCache = new PermissionsCache({ session: this._session })
    }
    return this._permissionCache
  },

  // Private methods
  // ---------------------------------------------------------------------------
  _enableFeatureFlags() {
    const featuresService = getOwner(this).lookup('service:features')
    if (!featuresService) return

    this.features.forEach((f) => featuresService.enable(f))
  },
  async _buildPermissionsCache() {
    if (!this._session.authorizedPermissions) return
    const permissionsCache = this.getPermissionCache()
    await permissionsCache.buildCache(this._session.authorizedPermissions)
  },
})

function readsFromSession() {
  return computed('_session', function (propertyName) {
    return this._session[propertyName]
  }).volatile()
}

function readsPossiblyEmberDataModelFromSession(modelName) {
  return computed('_memoizedSessionProperties', '_session', function (propertyName) {
    if (this._memoizedSessionProperties && this._memoizedSessionProperties[propertyName]) {
      return this._memoizedSessionProperties[propertyName]
    }
    const upstreamModel = this._session[propertyName]
    const owner = getOwner(this)
    const hasEmberData = !!owner.resolveRegistration('service:store')

    if (upstreamModel == null) return null

    let result
    if (!hasEmberData) {
      result = EmberObject.create(upstreamModel)
    } else {
      const asJsonAPIDoc = {
        data: {
          id: upstreamModel.id,
          type: modelName,
          attributes: upstreamModel,
        },
      }

      const store = owner.lookup('service:store')
      store.push(asJsonAPIDoc)
      result = store.peekRecord(modelName, upstreamModel.id)
    }
    if (!this._memoizedSessionProperties) {
      this._memoizedSessionProperties = {}
    }
    this._memoizedSessionProperties[propertyName] = result
    return result
  }).volatile()
}
