/* eslint-disable max-lines */
/**
 * NOTE: This is a temporary solution until we can get the @fast/auth library to
 * properly import into a React project.
 */

import { OtpSetupError, PasswordRotateError, SsoRecommendedError } from "./utils/errors"

import LegacyPermissionStore from "./permission-store"
import type { PermissionCacheType } from "./permissions"
import checkHeaders from "./utils/check-headers"
import jQuery from "jquery" // THIS REALLY NEEDS TO GO AWAY

export const API_UNREACHABLE = `api-unreachable`
const DEFAULT_API_ORIGIN = `https://api.fastly.com`
const DEFAULT_AUTH_PATH = `/auth/sign-in`
const DEFAULT_CLIENT = `@fastly/auth`
const DEFAULT_HISTORY = window.history
const DEFAULT_LOCATION = window.location
export const FASTLY_CLIENT_HEADER = `fastly-ui-client`
export const FASTLY_KEY_HEADER = `fastly-key`
const FUI_ADMIN_CUSTOMER_CONTEXT_KEY = `fui-admin__customer-context__id`

export const FASTLY_CUSTOMER_ID = `M4HCwJxJPGCIBSlRd5ETh`

export const ACTIVE_SESSION_TOKEN_KEY = `fastly-auth__session__active-token`
export const SESSION_STORE_KEY = `fastly-auth__session__token-store`
export const SUDO_REDIRECT_LS_KEY = `sudoReturnToUrl`
export const SUDO_BUFFER = 30000 // expire sudo locally 30s before server does
export const ADMIN_ROLE_DURATION_KEY = `fastly-auth--session--admin-role-duration`

type JqueryResponse = {
  jqXHR: JQuery.jqXHR
  readyState: string
  status: 404
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

type PromoteToAdminType = {
  customerId: string
  duration: number
}

type SwitchAccountOptionType = {
  retry?: boolean
  returnTo?: string
  otp?: string
  login?: object
}

type HeaderType = {
  [key: string]: string | undefined
}

type OptionType = {
  apiOrigin?: string
  authPath?: string
  client?: string
  data?: object
  history?: History
  location?: Location
  headers?: HeaderType
  signOutOn401?: boolean
  type?: string
}

type TokenType = {
  accessToken?: string
  access_token?: string
  created_at: number
  customer_id: string
  id: string
  saml?: string
  sudo_expires_at: number
}

type CustomerType = {
  id: string
  name: string
}

type TokenStore = {
  [key: string]: TokenType
}

enum UserRole {
  admin = `admin`,
  user = `user`,
}

type UserType = {
  admin_role_expires_at: number
  id: number | string
  name: string
  role: UserRole
  login: string
}

/**
 * An object that represents the current session and stores multiple tokens to
 * allow the user to switch between customer sessions
 *
 * Attributes: customer, features, signedIn, user.
 *
 * @prop {SessionOptions} options
 *
 * @export @public @class Session
 */
export default class Session {
  apiOrigin = DEFAULT_API_ORIGIN
  authPath = DEFAULT_AUTH_PATH
  client = DEFAULT_CLIENT
  customer: CustomerType | null = null
  account = null
  features: string[]
  history = DEFAULT_HISTORY
  location = DEFAULT_LOCATION
  permissions = new LegacyPermissionStore()
  authorizedPermissions: PermissionCacheType | null = null
  serviceIdsToNames = {}
  signedIn = false
  ssoLoginUrl: string | null = null
  sudoEnabled = false
  sudoTimer: number | null = null
  user: UserType | null = null

  constructor(options: OptionType) {
    this.apiOrigin = options.apiOrigin || DEFAULT_API_ORIGIN
    this.authPath = options.authPath || DEFAULT_AUTH_PATH
    this.client = options.client || DEFAULT_CLIENT
    this.customer = null
    this.account = null
    this.features = []
    this.history = options.history || DEFAULT_HISTORY
    this.location = options.location || DEFAULT_LOCATION
    // TODO consider renaming param to indicate legacy store
    // should be done with caution as this is used elsewhere
    this.permissions = new LegacyPermissionStore()
    this.serviceIdsToNames = {}
    this.signedIn = false
    this.sudoEnabled = false
    this.sudoTimer = null
    this.user = null
  }

  /**
   * To get the token for the current session, we first check in sessionStorage,
   * if there is no token there, we get the token that was most recently used
   * from the token store (for a new session)
   */
  get token(): TokenType | null {
    try {
      const sessionStoredToken = sessionStorage.getItem(ACTIVE_SESSION_TOKEN_KEY)
      if (sessionStoredToken == null) return this.getLatestCreatedTokenFromStore()
      return JSON.parse(sessionStoredToken) || this.getLatestCreatedTokenFromStore()
    } catch (e) {
      return null
    }
  }

  set token(token: TokenType | null) {
    try {
      // if a token is set to null, the intention is to log out all sessions
      if (token === null) {
        this.clearTokens()
      } else {
        // We store the new token in the session; the user is now logged into this
        // session with credentials for the token's customer
        sessionStorage.setItem(ACTIVE_SESSION_TOKEN_KEY, JSON.stringify(token))

        this.addTokenToStore(token)
      }
    } catch (e) {
      console.error(e)
    }
  }

  get tokenStore(): TokenStore {
    try {
      const storeJSON = localStorage.getItem(SESSION_STORE_KEY)
      return storeJSON ? JSON.parse(storeJSON) : {}
    } catch (e) {
      return {}
    }
  }

  set tokenStore(store: TokenStore) {
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(store))
  }

  /**
   * addTokenToStore
   *
   * tokens are stored as a map in local storage like this:
   * [SESSION_STORE_KEY]: {
   *   [customerId]: token:{ customerId, accessToken, ... }
   * }
   * with the store in place, when a user needs to switch customers in the
   * current session we can look and see if they already have a valid token
   * for that customer.
   */
  addTokenToStore(token: TokenType): void {
    const { tokenStore } = this
    const { customer_id } = token
    tokenStore[customer_id] = token
    this.tokenStore = tokenStore
  }

  removeTokenFromStore(token: TokenType): void {
    const { tokenStore } = this
    const { customer_id } = token
    delete tokenStore[customer_id]
    this.tokenStore = tokenStore
  }

  /**
   * getLatestCreatedTokenFromStore
   *
   * If sso, we need to try and validate the token even if expired so that we
   * can help the user re-auth with the response.
   *
   * @public
   * @memberof Session
   */
  getLatestCreatedTokenFromStore(): TokenType | null {
    try {
      return Object.values(this.tokenStore)
        .filter(filterNonSSOExpiredTokens)
        .sort((a, b) => {
          const dateB = new Date(b.created_at)
          const dateA = new Date(a.created_at)
          if (dateB < dateA) return -1
          if (dateB > dateA) return 1
          return 0
        })[0]
    } catch (err) {
      return null
    }
  }

  /**
   * clearTokens
   *
   * On logging out, the user is logged out of all sessions
   *
   * @public
   * @memberof Session
   */
  clearTokens(): void {
    localStorage.removeItem(SESSION_STORE_KEY)
    sessionStorage.removeItem(ACTIVE_SESSION_TOKEN_KEY)
  }

  get currentCustomerId(): string | null {
    return (
      sessionStorage.getItem(FUI_ADMIN_CUSTOMER_CONTEXT_KEY) ||
      localStorage.getItem(FUI_ADMIN_CUSTOMER_CONTEXT_KEY) ||
      this.customer?.id ||
      null
    )
  }

  get isInternalUser(): boolean {
    return this.customer?.id === FASTLY_CUSTOMER_ID
  }

  // parameters for promoting user to admin
  get promoteToAdminObject(): PromoteToAdminType {
    return JSON.parse(localStorage.getItem(ADMIN_ROLE_DURATION_KEY) || `false`)
  }

  // API: public
  //
  // Add session-related headers to an AJAX request's settings.
  addHeaders(options: OptionType): OptionType {
    options = Object.assign({ headers: {} }, options)

    const headers: HeaderType = {
      [FASTLY_CLIENT_HEADER]: this.client,
      [FASTLY_KEY_HEADER]: this.token?.accessToken || this.token?.access_token || undefined,
    }

    options.headers = Object.assign(options.headers, headers)
    return options
  }

  // API: public
  //
  // Make an authenticated AJAX request.
  ajax(url: string, options: OptionType): Promise<any> { //eslint-disable-line
    url = this.prependApiOrigin(url)
    options = this.addHeaders(options)

    return new Promise((resolve, reject) => {
      this.ajaxTransport(url, options)
        .then(resolve)
        .catch((response: JqueryResponse) => {
          let readyState, status
          if (response.jqXHR) {
            readyState = response.jqXHR.readyState
            status = response.jqXHR.status
          } else {
            readyState = response.readyState
            status = response.status
          }
          if (readyState === 0 || status === 0) {
            return reject(response)
          }
          if (status === 401 && options.signOutOn401 !== false) {
            this.ssoLoginUrl =
              (response.jqXHR || response).getResponseHeader(`Fastly-SSO-Login-Url`) || null
            didSignOut(this, false)
          }
          reject(response)
        })
    })
  }

  // API: private
  ajaxTransport(url: string, options: OptionType): JQuery.jqXHR<any> { //eslint-disable-line
    /** CRUFT: we need to remove the JQuery dependency from our applications, it
     will need to be removed here first */
    if (jQuery == null) {
      throw new Error(
        `@fastly/auth/session requires jQuery, ember-ajax, or a custom ajaxTransport implementation.`
      )
    }

    return jQuery.ajax(url, options)
  }

  msExpiresIn(until: number): number {
    const parsedUntil = Number.isInteger(until) ? until : Date.parse(String(until))
    const now = Date.now()

    if (this.sudoTimer) {
      window.clearTimeout(this.sudoTimer)
    }

    return parsedUntil - now - SUDO_BUFFER
  }

  didEnableSudo(until: number): void {
    if (this.sudoTimer) {
      window.clearTimeout(this.sudoTimer)
    }

    const msFromNow = this.msExpiresIn(until)
    if (msFromNow < 0) return

    this.sudoEnabled = true

    // setTimeout so we can run acceptance tests that make assertions _during_
    // sudo mode. If we used `Ember.run.later`, the test runner would block
    // until sudo mode expired.
    // See https://github.com/emberjs/ember.js/issues/3008
    this.sudoTimer = window.setTimeout(() => {
      this.sudoEnabled = false
    }, msFromNow)
  }

  enableSudoPassword(password: string): Promise<Session> {
    return this.ajax(`/sudo`, {
      data: { password },
      type: `post`,
    })
      .then((json) => {
        const expiry_time = json.hasOwnProperty(`payload`) // eslint-disable-line
          ? json.payload.expiry_time
          : json.expiry_time
        this.didEnableSudo(expiry_time)
        return this
      })
      .catch((response) => {
        return Promise.reject(response.responseJSON)
      })
  }

  enableSudoSaml(): Promise<void> {
    const returnTo = localStorage.getItem(SUDO_REDIRECT_LS_KEY)
    return this.ajax(`/saml/sudo`, {
      data: { return_to: returnTo },
      type: `post`,
    })
      .then((response) => {
        const samlRedirectUrl = response.hasOwnProperty(`payload`) // eslint-disable-line
          ? response.payload.saml_redirect_url
          : response.saml_redirect_url
        if (samlRedirectUrl) {
          localStorage.removeItem(SUDO_REDIRECT_LS_KEY)
          this.location.href = samlRedirectUrl
        }
      })
      .catch((response) => {
        return Promise.reject(response)
      })
  }

  breakglassToAdmin(duration: number): Promise<void> {
    if (this.token == null || this.token.customer_id !== FASTLY_CUSTOMER_ID) {
      return new Promise<void>((resolve) => resolve()) // eject silently
    }
    return this.ajax(`/admin/breakglass`, {
      data: { admin_role_expires_at: duration },
      type: `post`,
    })
  }

  maybeBreakglassToAdmin(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.promoteToAdminObject) return resolve() // we are not trying to promote to admin
      const {
        promoteToAdminObject: { customerId, duration },
      } = this
      if (customerId !== FASTLY_CUSTOMER_ID) return resolve()

      return this.breakglassToAdmin(duration)
        .then(() => {
          localStorage.removeItem(ADMIN_ROLE_DURATION_KEY)
          resolve()
        })
        .catch((error: Error) => {
          console.error(error)
          localStorage.removeItem(ADMIN_ROLE_DURATION_KEY)
          // TODO: do we need to do something with the error?
          resolve() // promoting failed for whatever reason, fail open
        })
    })
  }

  // API: public
  // Ensure that there is an active Fastly session. Returns a Promise.
  //
  // If there is a valid session, the Promise will resolve with a Session.
  //
  // If there is no session, the Promise will reject and will send the user
  // to the sign-in page. (Setting `window.location` doesn't take effect until
  // JavaScript yields.)
  //
  // You may optionally pass an options hash with `includeServices: true` to
  // have the response include a map of service IDs to names and store it on
  // the instance of Session as `serviceIdsToNames`
  ensureSession({ includeServices = false } = {}): Promise<Session> {
    return new Promise((resolve, reject) => {
      if (this.token == null) {
        return reject(didSignOut(this, true))
      }
      return this.maybeBreakglassToAdmin().then(() => {
        this.ajax(`/verify?${includeServices ? `active_services_only=true` : `services=false`}`, {
          signOutOn401: false,
        })
          .then((response: JqueryResponse) => {
            response = extractPayload(response)
            const { token } = this

            if (response.token.hasOwnProperty(`access_token`)) { // eslint-disable-line
              console.warn(`\`access_token\` found on \`response.token\`, removing`) // eslint-disable-line no-console
              delete response.token.access_token
            }

            Object.assign(token, response.token)
            this.token = token

            // Allow sudo to persist across browser reloads
            if (this.token?.sudo_expires_at) {
              this.didEnableSudo(this.token?.sudo_expires_at)
            }

            this.customer = response.customer
            this.features = response.features
            this.signedIn = true
            this.user = response.user
            if (response.authorized_permissions) {
              this.authorizedPermissions = response.authorized_permissions
            }

            // We get the timeout for a temporary admin directly on the /verify response
            // to avoid adding it onto the user model directly (thus avoiding this field
            // appearing for non-fastly users). Here we are adding it back onto the user
            // to help provide clarity when this is used later on
            if (response.admin_role_expires_at && this.user) {
              this.user.admin_role_expires_at = response.admin_role_expires_at
            }

            if (includeServices) {
              this.serviceIdsToNames = response.services
            }
            adjustCustomerIdQueryParam(this)

            return this.ajax(`/current_user/capabilities`, {})
          })
          .then((capabilities) => {
            this.permissions.add(extractPayload(capabilities))
            resolve(this)
          })
          .catch((errorResponse) => {
            let readyState, status
            if (errorResponse.jqXHR) {
              readyState = errorResponse.jqXHR.readyState
              status = errorResponse.jqXHR.status
            } else {
              readyState = errorResponse.readyState
              status = errorResponse.status
            }
            if (readyState === 0 || status === 0) {
              return reject(API_UNREACHABLE)
            }
            if (status === 401) {
              this.ssoLoginUrl = errorResponse.getResponseHeader(`Fastly-SSO-Login-Url`) || null
              if (this.ssoLoginUrl) {
                reject(attemptSSOReAuth(this))
              } else {
                reject(didSignOut(this, true))
              }
            } else {
              reject(errorResponse)
            }
          })
      })
    })
  }

  // API: public
  //
  // Prepend the apiOrigin onto the url unless it's already an absolute URL.
  prependApiOrigin(url: string): string {
    if (/^https?:\/\//.test(url)) return url
    const possibleSlash = /^\//.test(url) ? `` : `/`
    return `${this.apiOrigin}${possibleSlash}${url}`
  }

  /**
   * signOut
   *
   * Sign the user out and send them to the sign-in page.
   * Optionally by supplying an options hash with a value set for `ssoLoginUrl`,
   * users authenticated via single-sign on will be redirected to the authPath's
   * `/sso` subroute for re-authentication via the IDP's SAML endpoint.
   * This works for both Tango and Umbrella
   *
   * @public
   * @param {object} [{ signOutOn401 = false, ssoLoginUrl = null }={}]
   * @returns
   * @memberof Session
   */
  signOut({ signOutOn401 = false, ssoLoginUrl = null } = {}): Promise<Session> {
    // grab all the token ids from the store except the session token
    const idsToDelete = Object.values(this.tokenStore)
      .filter((token) => token.id !== this.token?.id)
      .map((token) => token.id)

    // first, delete those
    idsToDelete.forEach((id) => {
      this.ajax(`/tokens/${id}`, {
        signOutOn401: false,
        type: `delete`,
      }).catch(() => {}) // eslint-disable-line
    })

    // then, delete the session token, passing signOutOn401 this time
    // handle ssoLoginUrl and didSignOut with the response
    const { token } = this
    if (!token) didSignOut(this, false)
    const id = token?.id

    return this.ajax(`/tokens/${id}`, {
      signOutOn401,
      type: `delete`,
    }).then(({ jqXHR = null } = {}) => {
      this.ssoLoginUrl = jqXHR ? jqXHR.getResponseHeader(`Fastly-SSO-Login-Url`) : ssoLoginUrl
      didSignOut(this, false)
      return this
    })
  }

  /**
   * switchAccount - Set up the current session to view another customer
   *
   * To switch customers, we first check if we have a valid token in the store
   * for that customer, if we do, we set the session token to that one, if we
   * don't we use the current token to request another for the requested customer
   * when we have a valid token in the session for the new customer, we reload
   * the page to fetch the new customer's resources. If we get a 401 that's not
   * for SSO, we retry a max of 1 time if we have another valid token in the store.
   *
   * @param {String} customerId
   * @param {Object} options
   * @memberof Session
   *
   * @public
   */
  async switchAccount(
    customerId: string,
    { retry = true, returnTo, otp, login }: SwitchAccountOptionType = {}
  ): Promise<Session | void> {
    if (!customerId) {
      throw new Error(`Must provide a customer id`)
    }

    // Skip API call and auth checks if token is in store
    const { tokenStore } = this
    const tokenFromStore = tokenStore[customerId]
    if (tokenFromStore) {
      return setupNextAccount(this, tokenFromStore, returnTo)
    }

    try {
      // Get new token and check auth
      const options: OptionType = { signOutOn401: false }
      if (otp) options.headers = { "fastly-otp": otp }
      if (login) options.data = login
      const accountToken = extractPayload(
        await this.ajax(`/account-authorizations/${customerId}`, {
          type: `post`,
          ...options,
        })
      )
      return setupNextAccount(this, accountToken, returnTo)
    } catch (err: any) { // eslint-disable-line
      const errorResponse = err.jqXHR ? err.jqXHR : err

      // Check for known errors
      const header = checkHeaders(errorResponse)
      if (header === `otp:setup`) {
        throw new OtpSetupError()
      } else if (header === `password:rotate`) {
        throw new PasswordRotateError()
      }

      // Check for SSO
      this.ssoLoginUrl = errorResponse.getResponseHeader(`Fastly-SSO-Login-Url`) || null
      if ([400, 401].includes(errorResponse.status) && this.ssoLoginUrl) {
        // throw to service if not required
        if (errorResponse?.responseJSON?.error === `sso_recommended`) {
          // eslint-disable-line
          throw new SsoRecommendedError()
        }
        return attemptSSOReAuth(this, { removeToken: errorResponse.status === 401 })
      }

      // Check for Unauthorized and maybe retry
      if (errorResponse.status === 401 && returnTo) {
        if (!retry) return didSignOut(this, true)
        return await this.switchWithNextValidTokenOrSignOut(customerId, returnTo)
      }

      // throw any other errors
      throw errorResponse
    }
  }

  /**
   * switchWithNextValidTokenOrSignOut
   *
   * attempt to complete the switch with the next valid token or sign out.
   *
   * @param {string} customerId
   * @param {string} [returnTo]
   * @private
   * @memberof Session
   */
  async switchWithNextValidTokenOrSignOut(
    customerId: string,
    returnTo: string
  ): Promise<Session | void> {
    const { tokenStore } = this
    const validToken = Object.values(tokenStore).filter((token) => {
      if (token.saml) return false
      return filterNonSSOExpiredTokens(token)
    })[0]

    if (validToken) {
      // TODO log when this is hit to determine how edge casey it is
      this.token = validToken
      // only try switching account one more time
      await this.switchAccount(customerId, { retry: false, returnTo })
    } else {
      return didSignOut(this, true)
    }
  }
}

/**
 * setupNextAccount
 *
 * sets a new token for the session and reloads or navigates the window to begin
 * a new session under the next account.
 *
 * @private
 * @param {object} session
 * @param {object} token
 * @param {string} [returnTo=null]
 */
function setupNextAccount(session: Session, token: TokenType, returnTo?: string) {
  session.token = token
  session.signedIn = false
  if (returnTo) {
    session.location.href = returnTo
  } else {
    session.location.reload()
  }
}

function attemptSSOReAuth(session: Session, { removeToken = true } = {}) {
  if (removeToken && session.token) {
    //Remove the expired sso token from the tokenStore and sessionStorage
    session.removeTokenFromStore(session.token)
    sessionStorage.removeItem(SESSION_STORE_KEY)
  }
  session.ssoLoginUrl && dangerouslyRedirectToExternalURL(session.ssoLoginUrl)
}

function dangerouslyRedirectToExternalURL(url: string) {
  if (!url) return null
  const a = document.createElement(`a`)
  a.href = url
  a.hidden = true
  a.rel = `noopener noreferrer` // safety!
  a.dispatchEvent(
    new MouseEvent(`click`, {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  )
}

function didSignOut(session: Session, appendReturnTo: boolean) {
  session.clearTokens()
  session.customer = null
  session.features = []
  session.permissions = new LegacyPermissionStore()
  session.signedIn = false
  session.user = null
  let { authPath } = session

  if (session.ssoLoginUrl) {
    appendReturnTo = false
    localStorage.setItem(`ssoLoginUrl`, JSON.stringify(session.ssoLoginUrl))
    authPath = `${session.authPath}/sso`
  }
  session.location.href = signInUrl(authPath, session.location, appendReturnTo)
  return session
}

function signInUrl(authPath: string, location: Location, appendReturnTo: boolean) {
  const a = document.createElement(`a`)
  a.href = location.href
  a.pathname = authPath
  if (appendReturnTo) {
    a.search = `returnTo=${encodedReturnToPath(location)}`
  }
  return a.href
}

function encodedReturnToPath(location: Location) {
  return encodeURIComponent(location.href.replace(location.origin, ``))
}

function extractPayload(response: JqueryResponse) {
  // If ember-ajax has started, it will change $.ajax to resolve with
  // a { payload, textStatus, jqXHR, response } object instead of
  // multiple (payload, textStatus, jqXHR) arguments. It does this
  // because the formal Promises spec allows only resolving with a
  // single object; jQuery violates this.
  return response.payload || response
}

function adjustCustomerIdQueryParam(session: Session) {
  const { currentCustomerId, history, location, user } = session
  const href = new URL(location.href)

  const customerId = href.searchParams.get(`customerId`)
  const canUseCustomerId = [`internal`, `salesadmin`, `admin`].includes(user?.role || ``)

  if (canUseCustomerId && !customerId && currentCustomerId) {
    href.searchParams.set(`customerId`, currentCustomerId)
  } else if (!canUseCustomerId && customerId) {
    href.searchParams.delete(`customerId`)
  } else {
    return
  }

  history.replaceState(history.state, document.title, `${href}`)
}

/**
 * filterNonSSOExpiredTokens
 *
 * We do not filter out sso tokens even if they are expired because
 * we need to use the response from 401 on expired sso tokens to re-auth
 *
 * @private
 * @param {object} token
 */
function filterNonSSOExpiredTokens(token: TokenType) {
  const willExpire = new Date(token.created_at)
  willExpire.setDate(willExpire.getDate() + 2)
  return new Date() < willExpire
}
