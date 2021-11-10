import { createServer } from "miragejs";
import SharedMirage from "shared-mirage";
import config from "./config"
import _ from "lodash"

const formattedFactories = () => {
  return _.chain(SharedMirage.Factories)
    .keys()
    .map((f) => [_.camelCase(f), SharedMirage.Factories[f]])
    .fromPairs()
    .value()
}

function mirage ({ environment }) {
  return createServer({
    environment: environment,
    models: { },
    factories: formattedFactories(),
    seeds(){},
    routes(){
      _.keys(SharedMirage.RouteHandlers).forEach((handler) => {
        SharedMirage.RouteHandlers[handler]({
          server: this, 
          origin: config.origin, 
          config
        })
      })
    },
  })
}

export default mirage