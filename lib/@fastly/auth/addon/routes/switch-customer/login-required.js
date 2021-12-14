import Route from '@ember/routing/route'
import { set } from '@ember/object'

export default Route.extend({
  // Ember Hooks
  // ---------------------------------------------------------------------------

  beforeModel() {
    const loginRequiredController = this.controllerFor('switch-customer.login-required')
    if (!loginRequiredController.customerSwitchingEnabled) {
      this.transitionTo('switch-customer.choose-account')
    }
    this._super(...arguments)
  },

  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    willTransition(transition) {
      const loginRequiredController = this.controllerFor('switch-customer.login-required')
      set(loginRequiredController, 'customerSwitchingEnabled', false)
      if (transition.to.name === 'switch-customer.two-factor-auth') {
        const twoFactorAuthRoute = this.controllerFor('switch-customer.two-factor-auth')
        set(twoFactorAuthRoute, 'customerSwitchingEnabled', true)
      }
    },
  },
})
