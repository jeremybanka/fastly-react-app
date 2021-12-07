import Model from "./base-model"
import Session from "../session"
import { belongsTo } from "miragejs"

export const KEEP_TOKENS_KEY = "keepTokens"
const ServerSession = new Session()

export default Model.extend({
  customer: belongsTo(),
  user: belongsTo(),

  save(...args) {
    const result = Model.prototype.save.apply(this, args)
    const { _schema } = this

    // Mirage sets up the data on every load, so we set keepTokens when we do not
    // want to refresh them. This allows for the call to switch customers to work
    // - Steve Heydweiller | May 4th, 2020
    if (
      _schema.tokens.all().length === 1 &&
      !localStorage.getItem(KEEP_TOKENS_KEY)
    ) {
      ServerSession.clearTokens()
      ServerSession.token = result.attrs
    }

    return result
  },

  destroy() {
    ServerSession.clearTokens()
    return Model.prototype.destroy.apply(this, arguments) // eslint-disable-line
  },
})
