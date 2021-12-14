import Controller from '@ember/controller'
import { inject as service } from '@ember/service'

export default Controller.extend({
  router: service(),
  session: service(),

  // Properties
  // ---------------------------------------------------------------------------
  didComeFromRequireSudoRoute: false,
  previousRoute: '/',
  previousTransition: null,

  // Methods
  // ---------------------------------------------------------------------------
  onSudo() {
    const previousTransition = this.previousTransition

    if (previousTransition) {
      previousTransition.retry()
    }
  },
})
