import { alias, not, or } from '@ember/object/computed'
import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'
import { isBlank } from '@ember/utils'
import parseAPIError from '@fastly/auth/utils/parse-api-error'
import RSVP from 'rsvp'
import { inject as service } from '@ember/service'

export default Component.extend({
  ajax: service(),
  session: service(),

  // Passed Properties
  // ---------------------------------------------------------------------------
  onSudo: () => {},

  // Internal properties
  // ---------------------------------------------------------------------------
  error: null,
  password: '',
  isButtonDisabled: or('isRequestRunning', 'isPasswordMissing'),
  isPasswordMissing: not('isPasswordPresent'),
  isPasswordPresent: or('password', 'session._session.token.saml'),
  isSaml: alias('session._session.token.saml'),
  // Methods
  // ---------------------------------------------------------------------------
  enableSudo() {
    this.setProperties({
      error: null,
      isRequestRunning: true,
    })
    return new RSVP.Promise((resolve, reject) => {
      if ((this.session._session.token || {}).saml) {
        // If this request succeeds, it will forward the browser to the customer's IDP, so
        // no `.then` is necessary
        return this.session
          .enableSudoSaml()
          .catch((err) => {
            this.set('error', parseAPIError(err))
            reject(err)
          })
          .finally(() => this.set('isRequestRunning', false))
      } else {
        if (isBlank(this.password)) {
          this.set('error', 'You must enter your password')
          this.set('isRequestRunning', false)
          return resolve()
        }
        return this.session
          .enableSudoPassword(this.password)
          .then(() => {
            this.onSudo()
            resolve()
          })
          .catch((err) => {
            this.set('error', parseAPIError(err))
            resolve()
          })
          .finally(() => this.set('isRequestRunning', false))
      }
    })
  },

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{#if error}}
      <div class='fui-message fui-message--error text-align--left margin-bottom--m'>
      <svg class="fui-message__icon icon" data-rotate="0">
        <g stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
        <path d="M1.46655,13.8419617 C0.65655,13.8419617 5.96772631e-13,13.1855617 5.96855898e-13,12.3755617 C5.96855898e-13,12.1240117 0.0657,11.9645617 0.1773,11.6840617 L6.1623,1.39751171 C6.4458,0.919161714 6.90135,0.697611714 7.4265,0.612111714 L7.5738,0.612111714 C8.09865,0.697611714 8.55435,0.919161714 8.838,1.39751171 L14.82285,11.6839117 C14.9346,11.9645617 15,12.1240117 15,12.3754117 C15,13.1854117 14.34345,13.8418117 13.53345,13.8418117 L1.46655,13.8418117 L1.46655,13.8419617 Z M8.48737359,8.77817459 L6.61631473,8.77817459 L6,3.77817459 L9.10395159,3.77817459 L8.48737359,8.77817459 Z M6,11.288087 C6,10.4361128 6.649535,9.77817459 7.49045521,9.77817459 C8.33137543,9.77817459 9,10.435865 9,11.288087 C9,12.1204842 8.33113069,12.7781746 7.49045521,12.7781746 C6.649535,12.7781746 6,12.1204842 6,11.288087 Z"></path>
      </g>
      </svg>
        <div class='fui-message__content'>
          <div id='elevate-permissions-error' class='fui-message__body' role='alert'>{{error.body}}</div>
        </div>
      </div>
    {{/if}}
    {{#unless isSaml}}
      <div class='flex-col--1 margin-bottom--m'>
        <input
          class='fui-form__field full-width reauth-input'
          type='password'
          required=true
          value={{password}}
          onkeyup={{action (mut password) value='target.value'}}
          aria-describedby='elevate-permissions-error'
        />
      </div>
    {{/unless}}
    <div class='flex-col--1'>
      <button class='all-caps primary full-width reauth-trigger {{if isRequestRunning 'in-progress'}}' {{action enableSudo}} disabled={{isButtonDisabled}}>
        {{if isSaml "Continue with SSO" "Continue"}}
      </button>
    </div>
  `,
})
