import { Features } from "../../src/enums"
import type { MirageServer } from "../typings"
import defaultScenario from "../../src/mirage/default"
import setupCustomer from "../../src/mirage/scenarios/customer"
const DEFAULT_FEATURES = []
const MANDATORY_FEATURES = []

// mirage
// ---------------------------------------------------------------------------

type FixAnyPlease = any

function signIn(
  server: MirageServer,
  { user: userOverrides }: { user?: any } = {},
  features: Features[] = [],
  trait = "withTlsManagePermissions",
  accountOverrides = {}
): {
  customer: FixAnyPlease
  token: FixAnyPlease
  user: FixAnyPlease
} {
  if (features.length === 0) features = DEFAULT_FEATURES
  features = [...new Set(features.concat(MANDATORY_FEATURES))]
  const customer = setupCustomer(server, features, { name: "fastly" })
  const userOptions = Object.assign(
    {},
    { customer, role: "superuser" },
    userOverrides
  )

  const user = trait
    ? server.create("user", trait, userOptions)
    : server.create("user", userOptions)
  server.create("token", { customer, user })
  const token = server.create("token", { customer, user })
  server.session = { token }

  return { customer, token, user }
}

describe("My First Test", () => {
  it("redirects to the auth page if the user is not logged in", () => {
    cy.visit("http://localhost:3000/tls-configurations")
    cy.url().should("eq", "http://localhost:3000/auth")
  })

  it("shows the user_id and customer_id for fastly customer", () => {
    cy.mirage((server) =>
      signIn(server, { user: { login: "testadmin@fastly.com" } })
    )
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=user-1]").contains(
      "User: ID: 1 | login: testadmin@fastly.com | role: superuser"
    )
  })

  it("shows the user_id and customer_id for regular customer", () => {
    cy.mirage((server) =>
      signIn(server, {
        user: { login: "testuser@regularjoes.com", role: "user" },
      })
    )
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=user-1]").contains(
      "User: ID: 1 | login: testuser@regularjoes.com | role: user"
    )
  })

  it("does not allow a user to see the tls-configurations page if they are not authorized", () => {
    cy.mirage((server) =>
      signIn(
        server,
        { user: { login: "testuser@regularjoes.com", role: "user" } },
        [],
        ""
      )
    )
    cy.visit("http://localhost:3000/tls-configurations")
    cy.url().should("eq", "http://localhost:3000/auth")
  })

  it("shows the feature-check false when not enabled", () => {
    cy.mirage((server) => signIn(server))
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=feature-check]").contains(
      "Feature-check: exemptFromTlsBilling: false"
    )
  })

  it("shows the feature-check true when enabled", () => {
    cy.mirage((server) => signIn(server, {}, [Features.exemptFromTlsBilling]))
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=feature-check]").contains(
      "Feature-check: exemptFromTlsBilling: true"
    )
  })

  it("shows the data if the user is fully authed, has read permissions, and has the right features", () => {
    cy.mirage((server) => defaultScenario(server))
    cy.visit("http://localhost:3000/tls-configurations")
    cy.get("[data-testid=1]").contains("fastly-a")
  })
})
