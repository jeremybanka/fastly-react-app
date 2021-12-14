import { bool, not } from '@ember/object/computed'
import { computed, set } from '@ember/object'
import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'
import { readOnly } from '@ember/object/computed'
import { inject as service } from '@ember/service'

export default Component.extend({
  session: service(),
  router: service(),
  store: service(),

  // Internal properties
  // ---------------------------------------------------------------------------

  tagName: '',
  password: null,
  email: readOnly('session.user.login'),
  errorMessage: null,
  isRequestRunning: false,
  isPasswordPresent: bool('password'),
  isPasswordMissing: not('isPasswordPresent'),
  accountName: computed('session.switchCustomerParams.customerId', function () {
    return this.store.peekRecord('account', this.session.switchCustomerParams.customerId).name
  }),

  // CRUFT: There is a collision between style-guide's implementation of form-group
  // and Tango's. see https://github.com/fastly/Tango/blob/d36803b45ee066ad194b04efe5f4bf3b3a6119fc/app/pods/components/fui-field-label/component.js#L30
  // Remove after that is resolved in Tango.    --- Jeneve Parrish 5/20/2020
  registerLabelView: () => {},

  // Methods
  // ---------------------------------------------------------------------------

  submitLogin() {
    event.preventDefault()
    this.setProperties({
      isRequestRunning: true,
      errorMessage: null,
    })

    if (this.isPasswordMissing) {
      this.setProperties({
        errorMessage: {
          type: 'error',
          body: 'Password is required.',
        },
        isRequestRunning: false,
      })
      return
    }

    const { customerId, options = {} } =
      this.session.switchCustomerParams === undefined ? {} : this.session.switchCustomerParams

    return this.session
      .switchAccount(customerId, {
        ...options,
        login: { password: this.password, username: this.email },
      })
      .catch((err) => {
        // only need handle login invalid and display the error.
        const { payload, responseJSON } = err
        if (err.status === 400) {
          set(this, 'errorMessage', {
            type: 'error',
            body: (payload || responseJSON).error_description,
          })
        } else {
          throw err
        }
      })
      .finally(() => {
        if (!this.isDestroyed && !this.isDestroying) {
          set(this, 'isRequestRunning', false)
        }
      })
  },

  goToForgotPassword() {
    this.session.sendToForgotPassword()
  },

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    <h1 class='fui-auth-screen__header'>
      Switch Accounts
    </h1>
    <form role='form' class='fui-auth-screen__form' {{action submitLogin on='submit'}}>
      <p class='text-align--center'>Enter your password for {{email}} to sign in to <strong>{{accountName}}</strong></p>
      {{#if errorMessage}}
        <FuiAuthError
          @class="margin-top--m"
          @errorText="Login Failed. Try again or"
        />
      {{/if}}
      <FuiAuthInput
        @label='Password'
        @value={{password}}
        name='password'
        type='password'
        autocomplete='off'
        aria-describedby='password-validation'
        aria-invalid={{passwordInvalid}}
        aria-required={{true}}
        as |Input|
      >
        <Input.contextual-link>
          <button
            {{action goToForgotPassword}}
            class='fui-button--link'
          >
            Forgot your password?
          </button>
        </Input.contextual-link>
      </FuiAuthInput>

      <button
        disabled={{isRequestRunning}}
        class='fui-auth-form__button'
        type='submit'
      >
        Sign in
      </button>
    </form>
  `,
})
