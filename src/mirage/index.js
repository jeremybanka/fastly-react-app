import { dasherize, underscore } from "inflected"

import { createServer } from "miragejs"
import scenario from "./default"
import sharedMirage from "shared-mirage"

export function makeServer({ environment = "test" } = {}) {
  const baseConfig = {}
  for (const section in sharedMirage.fastly) {
    baseConfig[section] = Object.entries(sharedMirage.fastly[section]).reduce(
      (memo, [key, value]) =>
        Object.assign(memo, { [dasherize(underscore(key))]: value }),
      {}
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
    },
  }

  const server = createServer(fullConfig)
  return server
}
