import { NotFoundError } from 'ember-ajax/errors'
import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import { set } from '@ember/object'
import { SUDO_REDIRECT_LS_KEY } from '@fastly/auth/session'

export default Route.extend({
  session: service(),

  // Hooks
  // ---------------------------------------------------------------------------
  beforeModel() {
    const controller = this.controllerFor('elevate-permissions')
    if (!controller.didComeFromRequireSudoRoute) {
      throw new NotFoundError({ currentRoute: 'elevate-permissions' })
    }
    if (this.session.sudoEnabled) {
      const previousTransition = controller.previousTransition
      if (previousTransition) return previousTransition.retry()
      const originalLocation = controller.previousRoute
      const dest = localStorage.getItem(SUDO_REDIRECT_LS_KEY) || originalLocation
      return this.replaceWith(dest)
    }
  },

  actions: {
    willTransition() {
      set(this, 'controller.previousRoute', '/')
      set(this, 'controller.previousTransition', null)
      set(this, 'controller.didComeFromRequireSudoRoute', false)
      localStorage.removeItem(SUDO_REDIRECT_LS_KEY)
    },
  },
})
