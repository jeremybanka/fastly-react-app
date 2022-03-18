/* eslint-disable max-lines */
/**
 * NOTE: This is a temporary solution until we can get the @fast/auth library to
 * properly import into a React project.
 */

import { OtpSetupError, PasswordRotateError, SsoRecommendedError } from "./utils/errors"

import LegacyPermissionStore from "./permission-store"
// import type { CapabilitiesResponse } from "./permission-store"
import type { PermissionCacheType } from "./permissions"
import checkHeaders from "./utils/check-headers"

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

class FetchError extends Error {
  response?: Response
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

type ExtendedRequestInit = RequestInit & {
  signOutOn401?: boolean
  authPath?: string
  apiOrigin?: string
  history?: History
  location?: Location
  headers?: HeaderType
}

export type TokenType = {
  accessToken?: string
  access_token?: string
  created_at: number
  customer_id: string
  id: string
  saml?: string
  sudo_expires_at: number
}

export type CustomerType = {
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

export type Session = {
  apiOrigin: string
  authPath: string
  client: string
  customer: CustomerType | null
  features: string[]
  history: History
  location: Location
  permissions: LegacyPermissionStore
  promoteToAdminObject: PromoteToAdminType | null
  authorizedPermissions: PermissionCacheType | null
  serviceIdsToNames: Record<string, string>
  settled: boolean
  signedIn: boolean
  ssoLoginUrl: string | null
  sudoEnabled: boolean
  sudoTimer: number | null
  user: UserType | null
}

export const emptySession: Session = {
  apiOrigin: DEFAULT_API_ORIGIN,
  authPath: DEFAULT_AUTH_PATH,
  client: DEFAULT_CLIENT,
  customer: null,
  features: [],
  history: DEFAULT_HISTORY,
  location: DEFAULT_LOCATION,
  permissions: new LegacyPermissionStore(),
  promoteToAdminObject: null,
  authorizedPermissions: null,
  serviceIdsToNames: {},
  settled: false,
  signedIn: false,
  ssoLoginUrl: null,
  sudoEnabled: false,
  sudoTimer: null,
  user: null,
}

/**
 * To get the token for the current session, we first check in sessionStorage,
 * if there is no token there, we get the token that was most recently used
 * from the token store (for a new session)
 */
export const getToken = (): TokenType | null => {
  try {
    const sessionStoredToken = sessionStorage.getItem(ACTIVE_SESSION_TOKEN_KEY)
    if (sessionStoredToken == null) return getLatestCreatedTokenFromStore()
    return JSON.parse(sessionStoredToken) || getLatestCreatedTokenFromStore()
  } catch (e) {
    return null
  }
}

const setToken = (session: Session, token: TokenType | null) => {
  try {
    // if a token is set to null, the intention is to log out all sessions
    if (token === null) {
      clearTokens()
    } else {
      // We store the new token in the session; the user is now logged into this
      // session with credentials for the token's customer
      sessionStorage.setItem(ACTIVE_SESSION_TOKEN_KEY, JSON.stringify(token))

      addTokenToStore(session, token)
    }
  } catch (e) {
    console.error(e)
  }
}

const getTokenStore = (): TokenStore => {
  try {
    const storeJSON = localStorage.getItem(SESSION_STORE_KEY)
    return storeJSON ? JSON.parse(storeJSON) : {}
  } catch (e) {
    return {}
  }
}

const setTokenStore = (session: Session, store: TokenStore) => {
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
const addTokenToStore = (session: Session, token: TokenType): void => {
  const tokenStore = getTokenStore()
  const { customer_id } = token
  tokenStore[customer_id] = token
  setTokenStore(session, tokenStore)
}

const removeTokenFromStore = (session: Session): void => {
  const token = getToken()
  const tokenStore = getTokenStore()
  const customerId = token?.customer_id
  if (customerId) delete tokenStore[customerId]
  setTokenStore(session, tokenStore)
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
const getLatestCreatedTokenFromStore = (): TokenType | null => {
  try {
    return Object.values(getTokenStore())
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
const clearTokens = (): void => {
  localStorage.removeItem(SESSION_STORE_KEY)
  sessionStorage.removeItem(ACTIVE_SESSION_TOKEN_KEY)
}

const getCurrentCustomerId = (session: Session): string | null => {
  return (
    sessionStorage.getItem(FUI_ADMIN_CUSTOMER_CONTEXT_KEY) ||
    localStorage.getItem(FUI_ADMIN_CUSTOMER_CONTEXT_KEY) ||
    session.customer?.id ||
    null
  )
}

export const isInternalUser = (session: Session): boolean => {
  return session.customer?.id === FASTLY_CUSTOMER_ID
}

// parameters for promoting user to admin
const getPromoteToAdminObject = (): PromoteToAdminType => {
  return JSON.parse(localStorage.getItem(ADMIN_ROLE_DURATION_KEY) || `false`)
}

// API: public
//
// Add session-related headers to an AJAX request's settings.
const addHeaders = (session: Session, options: ExtendedRequestInit): ExtendedRequestInit => {
  options = Object.assign({ headers: {} }, options)

  const token = getToken()
  const headers: HeaderType = {
    [FASTLY_CLIENT_HEADER]: session.client,
    [FASTLY_KEY_HEADER]: token?.accessToken || token?.access_token || undefined,
  }

  options.headers = Object.assign(options.headers, headers)
  return options
}

// API: public
//
// Make an authenticated AJAX request.
export const ajax = (session: Session, url: string, options: ExtendedRequestInit): Promise<any> => { //eslint-disable-line
  url = prependApiOrigin(session, url)
  options = addHeaders(session, options)

  return new Promise((resolve, reject) => {
    ajaxTransport(url, options)
      .then(resolve)
      .catch((error: FetchError) => {
        let readyState, status
        // NO MERGE
        debugger // eslint-disable-line
        if (error.response) {
          // status = error.status
        } else {
          // readyState = response.readyState
          // status = response.status
        }
        if (readyState === 0 || status === 0) {
          // return reject(response)
        }
        /*
        if (status === 401 && options.signOutOn401 !== false) {
          this.ssoLoginUrl =
            (response.jqXHR || response).getResponseHeader(`Fastly-SSO-Login-Url`) || null
          didSignOut(this, false)
        }
        */
        reject(error)
      })
  })
}

// API: private
const ajaxTransport = (url: string, options: ExtendedRequestInit): Promise<Response> => {
  return fetch(url, options)
    .then((response: Response) => {
      if (response.status >= 200 && response.status < 300) return response
      const error = new FetchError(response.statusText)
      error.response = response
      throw error
    })
    .then((response: Response) => response.json())
}

const msExpiresIn = (session: Session, until: number): number => {
  const parsedUntil = Number.isInteger(until) ? until : Date.parse(String(until))
  const now = Date.now()

  if (session.sudoTimer) {
    window.clearTimeout(session.sudoTimer)
  }

  return parsedUntil - now - SUDO_BUFFER
}

const didEnableSudo = (session: Session, until: number): void => {
  if (session.sudoTimer) {
    window.clearTimeout(session.sudoTimer)
  }

  const msFromNow = msExpiresIn(session, until)
  if (msFromNow < 0) return

  session.sudoEnabled = true

  // setTimeout so we can run acceptance tests that make assertions _during_
  // sudo mode. If we used `Ember.run.later`, the test runner would block
  // until sudo mode expired.
  // See https://github.com/emberjs/ember.js/issues/3008
  session.sudoTimer = window.setTimeout(() => {
    session.sudoEnabled = false
  }, msFromNow)
}

export const enableSudoPassword = (
  session: Session,
  password: string
): Promise<Session | undefined> => {
  return ajax(session, `/sudo`, {
    body: JSON.stringify({ password }),
    method: `post`,
  })
    .then((json) => {
      const expiry_time = json.hasOwnProperty(`payload`) // eslint-disable-line
        ? json.payload.expiry_time
        : json.expiry_time
      didEnableSudo(session, expiry_time)
      return this
    })
    .catch((response) => {
      return Promise.reject(response.responseJSON)
    })
}

export const enableSudoSaml = (session: Session): Promise<void> => {
  const returnTo = localStorage.getItem(SUDO_REDIRECT_LS_KEY)
  return ajax(session, `/saml/sudo`, {
    body: JSON.stringify({ return_to: returnTo }),
    method: `post`,
  })
    .then((response) => {
      const samlRedirectUrl = response.hasOwnProperty(`payload`) // eslint-disable-line
        ? response.payload.saml_redirect_url
        : response.saml_redirect_url
      if (samlRedirectUrl) {
        localStorage.removeItem(SUDO_REDIRECT_LS_KEY)
        session.location.href = samlRedirectUrl
      }
    })
    .catch((response) => {
      return Promise.reject(response)
    })
}

const breakglassToAdmin = (session: Session): Promise<void> => {
  const token = getToken()
  if (token == null || token.customer_id !== FASTLY_CUSTOMER_ID) {
    return new Promise<void>((resolve) => resolve()) // eject silently
  }
  return ajax(session, `/admin/breakglass`, {
    body: JSON.stringify({ admin_role_expires_at: session.promoteToAdminObject?.duration }),
    method: `post`,
  })
}

const maybeBreakglassToAdmin = (session: Session): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!getPromoteToAdminObject()) return resolve() // we are not trying to promote to admin
    if (session.promoteToAdminObject?.customerId !== FASTLY_CUSTOMER_ID) return resolve()

    return breakglassToAdmin(session)
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
export const ensureSession = async (
  session: Session,
  { includeServices = false } = {}
): Promise<Session> => {
  try {
    let token = getToken()
    if (token == null) {
      return Object.assign({}, session, { settled: true })
    }
    await maybeBreakglassToAdmin(session)

    const response = await ajax(
      session,
      `/verify?${includeServices ? `active_services_only=true` : `services=false`}`,
      {
        signOutOn401: false,
      }
    )

    token = getToken()
    if (response.token == null) {
      return Object.assign({}, session, { settled: true })
    }

    if (response.token.hasOwnProperty(`access_token`)) { // eslint-disable-line
      console.warn(`\`access_token\` found on \`response.token\`, removing`) // eslint-disable-line no-console
      delete response.token.access_token
    }

    Object.assign(token, response.token)
    setToken(session, token)

    token = getToken()
    // Allow sudo to persist across browser reloads
    if (token?.sudo_expires_at) {
      didEnableSudo(session, token?.sudo_expires_at)
    }
    const newSession = Object.assign({}, session)

    newSession.customer = response.customer
    newSession.features = response.features
    newSession.signedIn = true
    newSession.user = response.user
    if (response.authorized_permissions) {
      newSession.authorizedPermissions = response.authorized_permissions
    }

    // We get the timeout for a temporary admin directly on the /verify response
    // to avoid adding it onto the user model directly (thus avoiding this field
    // appearing for non-fastly users). Here we are adding it back onto the user
    // to help provide clarity when this is used later on
    if (response.user.admin_role_expires_at && newSession.user) {
      newSession.user.admin_role_expires_at = response.user.admin_role_expires_at
    }

    if (includeServices) {
      newSession.serviceIdsToNames = response.services
    }
    adjustCustomerIdQueryParam(newSession)

    const capabilities = await ajax(newSession, `/current_user/capabilities`, {})

    newSession.permissions.add(capabilities)
    newSession.settled = true
    return newSession
  } catch (error) {
    debugger // eslint-disable-line
  }
  return session
}

// API: public
//
// Prepend the apiOrigin onto the url unless it's already an absolute URL.
const prependApiOrigin = (session: Session, url: string): string => {
  if (/^https?:\/\//.test(url)) return url
  const possibleSlash = /^\//.test(url) ? `` : `/`
  return `${session.apiOrigin}${possibleSlash}${url}`
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
export const signOut = async (
  session: Session,
  { signOutOn401 = false, ssoLoginUrl = null } = {}
): Promise<Session> => {
  // grab all the token ids from the store except the session token
  const idsToDelete = Object.values(getTokenStore())
    .filter((token) => token.id !== getToken()?.id)
    .map((token) => token.id)

  // first, delete those
  idsToDelete.forEach((id) => {
    ajax(session, `/tokens/${id}`, {
      signOutOn401: false,
      method: `delete`,
    }).catch(() => {}) // eslint-disable-line
  })

  // then, delete the session token, passing signOutOn401 this time
  // handle ssoLoginUrl and didSignOut with the response
  const token = getToken()
  if (!token) didSignOut(session, false)
  const id = token?.id

  const response = await ajax(session, `/tokens/${id}`, {
    signOutOn401,
    method: `delete`,
  })

  const newSession = Object.assign({}, session)
  newSession.ssoLoginUrl = response.getResponseHeader(`Fastly-SSO-Login-Url`) || ssoLoginUrl
  didSignOut(newSession, false)
  return newSession
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
const switchAccount = async (
  session: Session,
  customerId: string,
  switchAccount: SwitchAccountOptionType = {}
): Promise<Session | void> => {
  const { retry = true, returnTo, otp, login } = switchAccount
  if (!customerId) {
    throw new Error(`Must provide a customer id`)
  }

  // Skip API call and auth checks if token is in store
  const tokenStore = getTokenStore()
  const tokenFromStore = tokenStore[customerId]
  if (tokenFromStore) {
    return setupNextAccount(session, tokenFromStore, returnTo)
  }

  try {
    // Get new token and check auth
    const options: ExtendedRequestInit = { signOutOn401: false }
    if (otp) options.headers = { "fastly-otp": otp }
    if (login) options.body = JSON.stringify(login)
    const accountToken = await ajax(session, `/account-authorizations/${customerId}`, {
      method: `post`,
      ...options,
    })
    return setupNextAccount(session, accountToken, returnTo)
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
    session.ssoLoginUrl = errorResponse.getResponseHeader(`Fastly-SSO-Login-Url`) || null
    if ([400, 401].includes(errorResponse.status) && session.ssoLoginUrl) {
      // throw to service if not required
      if (errorResponse?.responseJSON?.error === `sso_recommended`) {
        // eslint-disable-line
        throw new SsoRecommendedError()
      }
      return attemptSSOReAuth(session, { removeToken: errorResponse.status === 401 })
    }

    // Check for Unauthorized and maybe retry
    if (errorResponse.status === 401 && returnTo) {
      if (!retry) return didSignOut(session, true)
      return await switchWithNextValidTokenOrSignOut(session, customerId, returnTo)
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
const switchWithNextValidTokenOrSignOut = async (
  session: Session,
  customerId: string,
  returnTo: string
): Promise<Session | void> => {
  const tokenStore = getTokenStore()
  const validToken = Object.values(tokenStore).filter((token) => {
    if (token.saml) return false
    return filterNonSSOExpiredTokens(token)
  })[0]

  if (validToken) {
    // TODO log when this is hit to determine how edge casey it is
    setToken(session, validToken)
    // only try switching account one more time
    await switchAccount(session, customerId, { retry: false, returnTo })
  } else {
    return didSignOut(session, true)
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
  setToken(session, token)
  session.signedIn = false
  // YIKES
  if (returnTo) {
    session.location.href = returnTo
  } else {
    session.location.reload()
  }
  return session
}

function attemptSSOReAuth(session: Session, { removeToken = true } = {}) {
  if (removeToken && getToken()) {
    //Remove the expired sso token from the tokenStore and sessionStorage
    removeTokenFromStore(session)
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
  clearTokens()
  const newSession = Object.assign({}, session)
  newSession.customer = null
  newSession.features = []
  newSession.permissions = new LegacyPermissionStore()
  newSession.signedIn = false
  newSession.user = null
  let { authPath } = session

  if (session.ssoLoginUrl) {
    appendReturnTo = false
    localStorage.setItem(`ssoLoginUrl`, JSON.stringify(session.ssoLoginUrl))
    authPath = `${session.authPath}/sso`
  }
  newSession.location.href = signInUrl(authPath, newSession.location, appendReturnTo)
  return newSession
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

function adjustCustomerIdQueryParam(session: Session) {
  const currentCustomerId = getCurrentCustomerId(session)
  const { history, location, user } = session
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
