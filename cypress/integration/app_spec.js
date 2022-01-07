/* globals cy */

import defaultScenario from "../../src/mirage/default.js"

describe("My First Test", () => {
  it("redirects to the auth page if the user is not logged in", () => {
    cy.visit("http://localhost:3000/tls-configurations")
    cy.url().should("eq", "http://localhost:3000/auth")
  })

  it("shows the user_id and customer_id", () => {})
  it("shows the feature-check true when enabled", () => {})
  it("shows the feature-check false when not enabled", () => {})
  it("shows the permission-check true when allowed", () => {})
  it("shows the permission-check false when not allowed", () => {})

  it("shows the data if the user is fully authed, has read permissions, and has the right features", () => {
    cy.mirage((server) => {
      defaultScenario(server)
      const ourCustomer = server.schema.customers.find("M4HCwJxJPGCIBSlRd5ETh")
      server.create("tls-configuration", {
        name: "---------------------------------- XINGO",
        id: "9999",
        customer: ourCustomer,
      })
    })
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=1]").contains("fastly-a")
  })
})
