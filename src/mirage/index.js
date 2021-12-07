import { JSONAPISerializer, createServer } from "miragejs"

import AuthRoutes from "./routes/auth"
import customerCapabilityFactory from "./factories/customer-capability"
import customerCapabilityModel from "./models/customer-capability"
import customerFactory from "./factories/customer"
import customerFeatureFactory from "./factories/customer-feature"
import customerFeatureModel from "./models/customer-feature"
import customerFeatureSerializer from "./serializers/customer-feature"
import customerModel from "./models/customer"
import featureFactory from "./factories/feature"
import featureModel from "./models/feature"
import featureSerializer from "./serializers/feature"
import scenario from "./default"
import tokenFactory from "./factories/token"
import tokenModel from "./models/token"
import userFactory from "./factories/user"
import userModel from "./models/user"

export function makeServer({ environment = "test" } = {}) {
  const server = createServer({
    models: {
      customer: customerModel,
      "customer-capability": customerCapabilityModel,
      "customer-feature": customerFeatureModel,
      feature: featureModel,
      token: tokenModel,
      user: userModel,
    },
    factories: {
      customer: customerFactory,
      "customer-capability": customerCapabilityFactory,
      "customer-feature": customerFeatureFactory,
      feature: featureFactory,
      token: tokenFactory,
      user: userFactory,
    },
    seeds(server) {
      return scenario(server)
    },
    serializers: {
      application: JSONAPISerializer,
      capabilities: JSONAPISerializer,
      "customer-feature": customerFeatureSerializer,
      feature: featureSerializer,
    },
    routes() {
      AuthRoutes({ server: this, origin: "https://api.fastly.com" })
    },
  })

  return server
}
