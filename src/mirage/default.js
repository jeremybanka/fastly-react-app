export const UNKNOWN_ERROR = "Unknown error encountered"
export const KEEP_TOKENS_KEY = "keepTokens"

function scenario(server) {
  const fastlyCustomer = server.create("customer", {
    name: "Fastly",
    id: "M4HCwJxJPGCIBSlRd5ETh",
  })
  const otherCustomer = server.create("customer")

  const personaId = "maua-persona-0001"

  const user = server.create("user", {
    customer: fastlyCustomer,
    role: "admin",
    login: "testadmin@fastly.com",
    personaId,
  })

  server.create("user", {
    customer: otherCustomer,
    role: "engineer",
    login: "engineer@other-customer.com",
    personaId,
  })

  const token = server.create("token", { customer: fastlyCustomer, user })

  server.create("customer-capability", {
    customer: fastlyCustomer,
    tls: ["read", "delete"],
  })

  server.create("customer-capability", {
    customer: otherCustomer,
    tls: ["read"],
  })

  const keepTokens = localStorage.getItem(KEEP_TOKENS_KEY)
  if (!keepTokens && server.session) {
    server.session.token = token
  }
}

export default scenario
