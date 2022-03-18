import { Model, createServer } from "miragejs"
import { camelize, dasherize, underscore } from "inflected"

import AuthRoutes from "./routes/auth"
import factories from "./factories"
import models from "./models"
import scenario from "./default"
import sharedMirage from "shared-mirage"
import spotlessRoutes from "./routes/spotless"

models.user = Model

const localMirage = {
  models,
  factories,
  serializers: {},
  fixtures: {},
}

export function makeServer({ environment = `test` } = {}) {
  const baseConfig = {}
  for (const section in localMirage) {
    baseConfig[section] = Object.entries(localMirage[section]).reduce(
      (memo, [key, value]) => Object.assign(memo, { [camelize(underscore(key), false)]: value }),
      {}
    )
  }
  for (const section in sharedMirage.fastly) {
    baseConfig[section] = Object.entries(sharedMirage.fastly[section]).reduce(
      (memo, [key, value]) => Object.assign(memo, { [dasherize(underscore(key))]: value }),
      baseConfig[section]
    )
  }

  const fullConfig = {
    environment,
    ...baseConfig,
    seeds(server) {
      return scenario(server)
    },
    routes() {
      AuthRoutes(this, { origin: `https://api.fastly.com` })
      // sharedMirage.routes.Auth(this, { origin: `https://api.fastly.com` })
      sharedMirage.routes.Iam(this, { origin: `https://api.fastly.com` })
      spotlessRoutes(this, { origin: `https://api.fastly.com` })
      this.passthrough(`https://jsonplaceholder.typicode.com/**`)
    },
  }
  return createServer(fullConfig)
}
