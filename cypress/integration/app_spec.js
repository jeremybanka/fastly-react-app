/* globals cy */
// import { makeServer } from "../../src/server"

/*
import { createServer } from "miragejs"
import defaultScenario from "../../src/mirage/default.js"
import { generateServerConfig } from "../../src/mirage/index.js"
describe("My First Test", () => {
  let server
  beforeEach(() => {
    const config = generateServerConfig({ environment: "test" })
    server = createServer(config)
    server.logging = true
  })

  afterEach(() => {
    debugger
    server.shutdown()
  })

  it("redirects to the auth page if the user is not logged in", () => {})
  it("shows the user_id and customer_id", () => {})
  it("shows the feature-check true when enabled", () => {})
  it("shows the feature-check false when not enabled", () => {})
  it("shows the permission-check true when allowed", () => {})
  it("shows the permission-check false when not allowed", () => {})
  it.only("shows the data if the user is fully authed, has read permissions, and has the right features", () => {
    defaultScenario(server)
    // makeAllTheShit(server)
    const ourCustomer = server.schema.customers.find("M4HCwJxJPGCIBSlRd5ETh")
    server.create("tls-configuration", {
      name: "---------------------------------- XINGO",
      id: "9999",
      customer: ourCustomer,
    })
    cy.visit("http://localhost:3000/tls-configurations")
    // Somehow ensure that we have some number of items displayed
    // Click on a tls-configuration and see details (and check the URL gets changed)
    // cy.contains("type")
  })
})
*/

describe("user list", () => {
  /*
  let server

  beforeEach(() => {
    server = makeServer({ environment: "test" })
  })

  afterEach(() => {
    server.shutdown()
  })
  */

  it.only("shows the users from our server", () => {
    cy.mirage((server) => {
      server.create("user", { id: 1, name: "Luke" })
      server.create("user", { id: 2, name: "Leia" })
    })

    cy.visit("http://localhost:3000/")

    cy.get('[data-testid="user-1"]').contains("Luke")
    cy.get('[data-testid="user-2"]').contains("Leia")
  })

  it("shows a message if there are no users", () => {
    // Don't create any users

    cy.visit("http://localhost:3000/")

    cy.get('[data-testid="no-users"]').should("be.visible")
  })
})
