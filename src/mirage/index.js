import { dasherize, underscore } from "inflected"

import { createServer } from "miragejs"
import scenario from "./default"
import sharedMirage from "shared-mirage"

import dnsRecord from "./models/dns-record"
import tlsConfiguration from "./models/tls-configuration"
import spotlessRoutes from "./routes/spotless"
import tlsConfigurationFactory from "./factories/tls-configuration"
import dnsRecordFactory from "./factories/dns-record"

export function makeServer({ environment = "test" } = {}) {
  const baseConfig = {}
  for (const section in sharedMirage.fastly) {
    baseConfig[section] = Object.entries(sharedMirage.fastly[section]).reduce(
      (memo, [key, value]) =>
        Object.assign(memo, { [dasherize(underscore(key))]: value }),
      {}
    )
  }

  baseConfig.models.dnsRecord = dnsRecord
  baseConfig.models.tlsConfiguration = tlsConfiguration
  baseConfig.factories.tlsConfiguration = tlsConfigurationFactory
  baseConfig.factories.dnsRecord = dnsRecordFactory

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
