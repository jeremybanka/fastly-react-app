import SharedMirage from "shared-mirage"
import _ from "lodash"
import config from "./config"
import { createServer } from "miragejs"
import customerCapabilityFactory from "./factories/customer-capability"
import customerCapabilityModel from "./models/customer-capability"
import customerFactory from "./factories/customer"
import customerModel from "./models/customer"
import scenario from "./default"
import tokenFactory from "./factories/token"
import tokenModel from "./models/token"
import userFactory from "./factories/user"
import userModel from "./models/user"

/*
const formattedFactories = () => {
  return _.chain(SharedMirage.Factories)
    .keys()
    .map((f) => [_.camelCase(f), SharedMirage.Factories[f]])
    .fromPairs()
    .value()
}
*/

function mirage() {
  return createServer({
    models: {
      user: userModel,
      customer: customerModel,
      "customer-capability": customerCapabilityModel,
      token: tokenModel,
    },
    factories: {
      customer: customerFactory,
      "customer-capability": customerCapabilityFactory,
      token: tokenFactory,
      user: userFactory,
    },
    seeds(server) {
      return scenario(server)
    },
    routes() {
      _.keys(SharedMirage.RouteHandlers).forEach((handler) => {
        SharedMirage.RouteHandlers[handler]({
          server: this,
          origin: config.origin,
          config,
        })
      })
    },
  })
}

export default mirage
