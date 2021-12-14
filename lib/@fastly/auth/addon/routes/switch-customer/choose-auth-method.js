import Route from '@ember/routing/route'
import { set } from '@ember/object'

export default Route.extend({
  // Ember Hooks
  // ---------------------------------------------------------------------------

  beforeModel() {
    const chooseAuthMethodController = this.controllerFor('switch-customer.choose-auth-method')
    if (!chooseAuthMethodController.customerSwitchingEnabled) {
      // this.transitionTo('switch-customer.choose-account')
    }
    this._super(...arguments)
  },

  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    willTransition(transition) {
      const chooseAuthMethodController = this.controllerFor('switch-customer.choose-auth-method')
      set(chooseAuthMethodController, 'customerSwitchingEnabled', false)
      if (transition.to.name === 'switch-customer.login-required') {
        const loginRequiredRoute = this.controllerFor('switch-customer.login-required')
        set(loginRequiredRoute, 'customerSwitchingEnabled', true)
      }
    },
  },
})
