import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import { set } from '@ember/object'
import { SUDO_REDIRECT_LS_KEY } from '@fastly/auth/session'

export default Route.extend({
  // injecting as `routerService` rather than `router` to deal with a bug in
  // older versions of ember where `Route.router` always returns a reference
  // to `router:main`
  routerService: service('router'),
  session: service(),

  sudoRedirectUrl(transition) {
    const routeParams = transition.routeInfos
      ? transition.routeInfos.map((route) => route.params)
      : transition.params
    const collectedParams = Object.assign({}, ...Object.values(routeParams))
    // apparently if you pas ANYTHING as the second param to urlFor and dynamic segments
    // are not needed things break
    if (Object.keys(collectedParams).length) {
      return this.routerService.urlFor(transition.targetName, collectedParams)
    } else {
      return this.routerService.urlFor(transition.targetName)
    }
  },

  // Hooks
  // ---------------------------------------------------------------------------
  beforeModel(transition) {
    if (!this.session.sudoEnabled) {
      const elevatePermissionsController = this.controllerFor('elevate-permissions')
      if ((this.session._session.token || {}).saml) {
        const currentRouteUrl = this.sudoRedirectUrl(transition)
        set(elevatePermissionsController, 'previousRoute', currentRouteUrl)
        localStorage.setItem(SUDO_REDIRECT_LS_KEY, currentRouteUrl)
      } else {
        set(elevatePermissionsController, 'previousTransition', transition)
      }
      set(elevatePermissionsController, 'didComeFromRequireSudoRoute', true)
      this.transitionTo('elevate-permissions')
    }
  },
})
