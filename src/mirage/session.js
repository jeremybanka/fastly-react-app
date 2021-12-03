const ACTIVE_SESSION_TOKEN_KEY = 'fastly-auth__session__active-token'
const SESSION_STORE_KEY = 'fastly-auth__session__token-store'

/**
 * In the fastly-auth library, Session is an object that represents the current
 * session and stores multiple tokens to allow the user to switch between
 * customer sessions.
 *
 * Enough is ported here to manage storage and retrieval of tokens in Mirage; The
 * application uses the Session Service.
 *
 *
 * @export
 * @public
 * @class Session
 */
export default class Session {
  get token(): Token | null {
    try {
      return JSON.parse(sessionStorage.getItem(ACTIVE_SESSION_TOKEN_KEY) || '')
    } catch (e) {
      return null
    }
  }

  set token(token: Token | null) {
    try {
      // if a token is set to null, the intention is to log out all sessions
      if (token === null) {
        this.clearTokens()
        return
      }

      // We store the new token in the session; the user is now logged into this
      // session with credentials for the token's customer
      sessionStorage.setItem(ACTIVE_SESSION_TOKEN_KEY, JSON.stringify(token))

      this.addTokenToStore(token)
    } catch (e) {
      console.error(e)
      return
    }
  }

  get tokenStore(): AnyObject {
    try {
      const storeJSON = localStorage.getItem(SESSION_STORE_KEY)
      return storeJSON ? JSON.parse(storeJSON) : {}
    } catch (e) {
      return {}
    }
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
  addTokenToStore(token: Token): void {
    this.tokenStore[token.customer_id] = token
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(this.tokenStore))
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
}
