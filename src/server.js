import { Model, createServer } from "miragejs"

import { JSONAPISerializer } from "miragejs"

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,
    serializers: {
      application: JSONAPISerializer,
    },

    models: {
      user: Model,
    },

    seeds(server) {
      console.log("---------------------- SETTING UP THE SEEDS!")
      server.create("user", { name: "Bob" })
      server.create("user", { name: "Alice" })
    },

    routes() {
      this.urlPrefix = "https://api.fastly.com/api"

      this.get("/users", (schema) => {
        return schema.users.all()
      })
    },
  })

  return server
}
