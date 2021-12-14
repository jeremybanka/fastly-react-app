import Route from '@ember/routing/route'
import { set } from '@ember/object'

export default Route.extend({
  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    willTransition(transition) {
      const nextController = this.controllerFor(transition.to.name)

      set(nextController, 'customerSwitchingEnabled', true)
    },
  },
})
