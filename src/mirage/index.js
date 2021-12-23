import { dasherize, underscore, camelize } from "inflected"

import { createServer } from "miragejs"
import factories from "./factories"
import models from "./models"
import scenario from "./default"
import sharedMirage from "shared-mirage"
import spotlessRoutes from "./routes/spotless"

const localMirage = {
  models,
  factories,
  serializers: {},
  fixtures: {},
}

export function makeServer({ environment = "test" } = {}) {
  const baseConfig = {}
  for (const section in localMirage) {
    baseConfig[section] = Object.entries(localMirage[section]).reduce(
      (memo, [key, value]) =>
        Object.assign(memo, { [camelize(underscore(key), false)]: value }),
      {}
    )
  }
  for (const section in sharedMirage.fastly) {
    baseConfig[section] = Object.entries(sharedMirage.fastly[section]).reduce(
      (memo, [key, value]) =>
        Object.assign(memo, { [dasherize(underscore(key))]: value }),
      baseConfig[section]
    )
  }

  const fullConfig = {
    ...baseConfig,
    seeds(server) {
      return scenario(server)
    },
    routes() {
      const server = this
      sharedMirage.routes.Auth(server, { origin: "https://api.fastly.com" })
      sharedMirage.routes.Iam(server, { origin: "https://api.fastly.com" })
      spotlessRoutes(server, { origin: "https://api.fastly.com" })
    },
  }

  const server = createServer(fullConfig)
  return server
}
