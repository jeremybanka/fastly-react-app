import { ADMIN_ROLE_DURATION_KEY, SUDO_REDIRECT_LS_KEY } from '@fastly/auth/session'
import { and, bool, equal, reads } from '@ember/object/computed'

import Component from '@ember/component'
import { computed } from '@ember/object'
import layout from '../../templates/components/admin-escalation/duration-menu'
import moment from 'moment'
import { inject as service } from '@ember/service'

export default Component.extend({
  async init() {
    this._super()
    this.durations = [1, 4, 16, 24] // hours
  },

  session: service(),
  router: service(),

  tagName: '',

  layout,

  expiresAt: reads('session.user.adminRoleExpiresAt'),
  userIsAdmin: equal('session.user.role', 'admin'),
  isPromoted: and('userIsAdmin', 'expiresAt'),

  showExpirationWarning: bool('session.showAdminRoleExpirationWarning'),

  localExpiresAtTime: computed('expiresAt', function () {
    return moment.utc(this.expiresAt).local().format('YYYY-MM-DD HH:mm')
  }),

  /**
   * Flow for promoting to admin:
   *  1. Select a duration from the menu
   *  2. Set object containing requested duration to LocalStorage
   *  3. Enter sudo mode via /saml/sudo (user sent to Okta)
   *
   *  -- This happens in @fastly/auth/session --
   *  4. Immediately upon return from Okta, calls /admin/breakglass (before call to /verify)
   *      - Northstar sets the users role to `admin` and sets it to expire in `duration`
   *  5. Users passes through the standard `/verify` call and the UI is setup with user as an admin
   *  6. Two timers are set
   *    1. to warn the user 5 minutes before expiration
   *    2. to change the user back to salesadmin 30 seconds before the server expiration (same expiration buffer we use with sudo)
   *
   * Flow for adding time to role expiration
   *  1. Select duration to add
   *
   *  -- This happens in @fastly/auth/session --
   *  2. Calls `/admin/breakglass` (note: no sudo required for adding time)
   *      - Northstar adds the requested duration and responds with the new expiration timestamp
   *  3. Reset the users `admin_role_expires_at`
   *  4. Reset the timers
   *
   * @param {number} duration an integer (between 1 and 24) respresenting the number of hours to retain the `admin` role
   */
  async doPromoteToAdmin(duration) {
    try {
      if (this.session.user.isTemporaryAdmin) {
        await this.session.breakglassToAdmin(duration)
      } else {
        const currentRouteUrl = this.router.currentURL
        localStorage.setItem(SUDO_REDIRECT_LS_KEY, currentRouteUrl)
        localStorage.setItem(
          ADMIN_ROLE_DURATION_KEY,
          JSON.stringify({
            duration,
            customerId: this.session.customer.id,
          })
        )
        await this.session.enableSudoSaml()
      }
    } catch (error) {
      console.error(error)
    }
  },
})
