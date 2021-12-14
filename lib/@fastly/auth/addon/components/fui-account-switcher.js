import { OtpSetupError, PasswordRotateError } from '@fastly/auth/utils/errors'
import { set, setProperties } from '@ember/object'
import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'
import { inject as service } from '@ember/service'

export default Component.extend({
  // services
  session: service(),
  store: service(),

  // Internal Properties
  // ---------------------------------------------------------------------------
  accounts: null,
  tagName: '',
  isRequestRunning: false,
  loading: false,
  error: null,

  // Methods
  // ---------------------------------------------------------------------------
  async fetchAccounts() {
    setProperties(this, {
      loading: true,
      didError: false,
    })

    const user = this.session.user

    const accounts = await this.store
      .query('account', { userId: user.id })
      .catch((err) => {
        console.error(err)
        set(this, 'error', 'fetchError')
      })
      .finally(() => {
        set(this, 'loading', false)
      })

    set(this, 'accounts', accounts)
  },
  /**
   * Switch the current session to the chosen account,
   * bailing early if the chosen account is the currentSession
   *
   * @param {Object} account
   * @param {string} account.id
   * @param {boolean} account.currentSession
   */
  handleChooseAccount({ id, currentSession }) {
    if (currentSession) return

    setProperties(this, {
      isRequestRunning: true,
      didError: false,
    })

    return this.session
      .switchAccount(id)
      .catch((err) => {
        if (err instanceof OtpSetupError) {
          set(this, 'error', 'otpSetupError')
        } else if (err instanceof PasswordRotateError) {
          set(this, 'error', 'passwordRotateError')
        } else {
          set(this, 'error', 'authError')
        }
      })
      .finally(() => {
        if (!this.isDestroyed && !this.isDestroying) {
          set(this, 'isRequestRunning', false)
        }
      })
  },

  handleKeyUp(account) {
    const ENTER_KEY_CODE = 13
    if (event.keyCode === ENTER_KEY_CODE) {
      this.handleChooseAccount(account)
    }
  },

  // Ember Hooks
  // ---------------------------------------------------------------------------
  init() {
    this.fetchAccounts()
    this._super(...arguments)
  },

  // Template
  // ---------------------------------------------------------------------------

  layout: hbs`
    <h1 class='fui-auth-screen__header'>
      Switch Accounts
    </h1>

    <p class='margin-bottom--m padding-x--m  text-align--left'>
      Switch to another account linked to {{session.user.login}}.
    </p>

    {{#if (eq error 'authError')}}
      <FuiAuthError />
    {{else if (eq error 'fetchError')}}
      <FuiAuthError
        @errorText='A problem occured while fetching accounts. Try again or'
      />
    {{else if (eq error 'otpSetupError')}}
      <FuiAuthError
        @errorText='2FA is required. To enable this now, visit your'
        @linkText='account settings'
        @link='/account/security'
      />
    {{else if (eq error 'passwordRotateError')}}
      <FuiAuthError
        @errorText='To switch accounts,'
        @linkText='reset your password'
        @link='/account/personal/password'
      />
    {{/if}}

  <ul class='fui-account-switcher__list list--outdented list--unbulleted padding--xs'>
    {{#each accounts as |account|}}
      <li
        tabindex='0'
        role='button'
        aria-current={{if account.currentSession 'true' false}}
        aria-disabled={{if account.currentSession 'true' false}}
        class='fui-account-switcher__list-item fui-card fui-card--accentuated fui-card--focus-ring flex-row flex-row--vcenter padding--m'
        onclick={{action handleChooseAccount account}}
        onkeyup={{action handleKeyUp account}}
      >
        <div class='flex-col--1 text-align--left'>
          <p class='head-bold'>{{account.name}}</p>
          <p class='color--grey'>{{account.id}}</p>
        </div>
        {{#if account.defaultAccount}}
          <div class='font--italic margin-x--l'>Default</div>
        {{/if}}
        <div class="fui-account-switcher__action">
          {{#if account.currentSession}}
            <span class='fui-tag fui-tag--emerald'>Signed In</span>
          {{else}}
            <span class='flex-col--pushed fui-button--link button'>
              Sign In
            </span>
          {{/if}}
        </div>
      </li>
    {{else}}
      <li
        class='fui-account-switcher__list-item fui-account-switcher__list-item--fixed-height fui-card fui-skeleton-overlay'
      />
      <li
        class='fui-account-switcher__list-item fui-account-switcher__list-item--fixed-height fui-card fui-skeleton-overlay'
      />
      <li
        class='fui-account-switcher__list-item fui-account-switcher__list-item--fixed-height fui-card fui-skeleton-overlay'
      />
      <li
        class='fui-account-switcher__list-item fui-account-switcher__list-item--fixed-height fui-card fui-skeleton-overlay'
      />
    {{/each}}
  </ul>

  <p class='color--grey padding--s'>
    Don't see the account you're looking for?
    <ExternalLinkTo
      @text='Contact Support'
      @href='https://www.fastly.com/support'
    />.
  </p>
  `,
})
