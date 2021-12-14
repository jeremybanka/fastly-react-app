/**
 * fastlyAuthRequiredRoutes - add all the routes this library exports.
 * Usage:
 * ```js
 *  import authRequiredRoutes from '@fastly/auth/utils/fastly-auth-required-routes'
 *  [...]
 *
 *  Router.map(function() {
 *   authRequiredRoutes.apply(this)
 *   [...]
 * ```
 *
 * @export
 */
export default function fastlyAuthRequiredRoutes() {
  this.route('switch-customer', function () {
    this.route('two-factor-auth')
    this.route('choose-account')
    this.route('login-required')
    this.route('choose-auth-method')
  })
  this.route('elevate-permissions')
}
