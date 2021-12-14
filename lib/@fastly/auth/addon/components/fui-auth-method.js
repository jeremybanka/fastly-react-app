import Component from '@ember/component'
import { computed } from '@ember/object'
import hbs from 'htmlbars-inline-precompile'
import { readOnly } from '@ember/object/computed'
import { inject as service } from '@ember/service'

export default Component.extend({
  tagName: '',
  session: service(),
  store: service(),

  accountName: computed('session.switchCustomerParams.customerId', function () {
    return this.store.peekRecord('account', this.session.switchCustomerParams.customerId).name
  }),

  ssoLoginUrl: readOnly('session.ssoLoginUrl'),
  layout: hbs`
    <h1 class="fui-auth-screen__header">Choose how to sign into <strong>{{accountName}}</strong></h1>
    <div class="padding-x--xxl padding-bottom--l">
      <ExternalLinkTo
        @href={{ssoLoginUrl}}
        class="button primary fui-login-form__button margin-bottom--l"
        aria-label="Sign in with single sign-on"
        target="_self"
      >
        Single sign-on
      </ExternalLinkTo>
      <LinkTo
        @route="switch-customer.login-required"
        class="button new fui-login-form__button margin-left--0"
        aria-label="Sign in with email and password"
      >
        Email and password
      </LinkTo>
    </div>
  `,
})
