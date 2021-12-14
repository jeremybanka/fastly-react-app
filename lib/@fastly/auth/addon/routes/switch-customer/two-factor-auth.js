import Route from '@ember/routing/route'
import { set } from '@ember/object'

export default Route.extend({
  // Ember Hooks
  // ---------------------------------------------------------------------------

  beforeModel() {
    const twoFactorController = this.controllerFor('switch-customer.two-factor-auth')
    if (!twoFactorController.customerSwitchingEnabled) {
      this.transitionTo('switch-customer.choose-account')
    }
    this._super(...arguments)
  },

  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    willTransition() {
      const twoFactorController = this.controllerFor('switch-customer.two-factor-auth')
      set(twoFactorController, 'customerSwitchingEnabled', false)
    },
  },
})
