import Mixin from '@ember/object/mixin'
import { inject as service } from '@ember/service'
import Session from '../session'

export default Mixin.create({
  session: service(),

  init() {
    this._super(...arguments)
    this.session._session.ajaxTransport = this.raw.bind(this)
  },

  willDestroy() {
    this._super(...arguments)
    const session = this.session._session
    if (session) {
      session.ajaxTransport = Session.prototype.ajaxTransport
    }
  },

  // Warning: this overrides a private method in ember-ajax's service:ajax.
  // The public API for adding headers is the `headers` computed property,
  // but that can't take the HTTP verb of the request into consideration,
  // which we need for the CSRF header.
  options() {
    const result = this._super(...arguments)
    return this.session.ajaxOptions(result)
  },

  request(url, options) {
    url = this.session._session.prependApiOrigin(url)
    return this._super(url, options)
  },
})
