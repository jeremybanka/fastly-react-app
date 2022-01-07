export const UNKNOWN_ERROR = "Unknown error encountered"
export const KEEP_TOKENS_KEY = "keepTokens"
const ALL_FEATURES = [
  "darkMode",
  "keyAndCertRotation",
  "disableNetworkManagement",
  "exemptFromTlsBilling",
  "gsEmailValidations",
  "rateLimiting",
  "secureAtEdge",
  "tlsKeysPage",
  "waf",
  "enforce_enhanced_rbac",
]
const DEFAULT_FEATURES = ["gsEmailValidations"]

function scenario(server) {
  const fastlyCustomer = server.create("customer", {
    name: "Fastly",
    id: "M4HCwJxJPGCIBSlRd5ETh",
  })
  const otherCustomer = server.create("customer")

  const personaId = "maua-persona-0001"

  const user = server.create("user", "withTlsManagePermissions", {
    customer: fastlyCustomer,
    role: "admin",
    login: "testadmin@fastly.com",
    personaId,
  })

  server.create("user", "withTlsReadPermissions", {
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

  const features = ALL_FEATURES.reduce((memo, name) => {
    memo[name] = server.create("feature", {
      availability: "private",
      enabled: true,
      name,
    })
    return memo
  }, {})

  DEFAULT_FEATURES.forEach((featureName) => {
    ;[fastlyCustomer, otherCustomer].forEach((customer) => {
      server.create("customer-feature", {
        customerId: customer.id,
        featureId: features[featureName].id,
      })
      customer.features.models.push(features[featureName])
    })
  })

  // Spotless-specific data
  // ---------------------------------------------------------------------------
  ;[
    { id: "151.101.2.133", region: "global", recordType: "A" },
    { id: "151.101.66.133", region: "global", recordType: "A" },
    { id: "151.101.130.133", region: "global", recordType: "A" },
    { id: "151.101.194.133", region: "global", recordType: "A" },
    { id: "d.sni.global.fastly.net", region: "global", recordType: "CNAME" },

    { id: "151.111.11.199", region: "mbx100", recordType: "A" },
    { id: "151.111.28.199", region: "mbx100", recordType: "A" },
    { id: "151.111.34.199", region: "mbx100", recordType: "A" },
    { id: "151.111.99.199", region: "mbx100", recordType: "A" },
    { id: "2a04:4e42:900:115", region: "mbx100", recordType: "AAAA" },
    { id: "2a04:4e42:200::115", region: "mbx100", recordType: "AAAA" },
    { id: "2a04:4e42:400::115", region: "mbx100", recordType: "AAAA" },
    { id: "2a04:4e42:600::115", region: "mbx100", recordType: "AAAA" },
    { id: "d.sni.us-eu.fastly.net", region: "mbx100", recordType: "CNAME" },

    { id: "151.128.88.201", region: "mbz200", recordType: "A" },
    { id: "151.128.98.201", region: "mbz200", recordType: "A" },
    { id: "151.128.112.201", region: "mbz200", recordType: "A" },
    { id: "151.128.75.201", region: "mbz200", recordType: "A" },
    { id: "2a04:4e42:900:99", region: "mbz200", recordType: "AAAA" },
    { id: "2a04:4e42:200::99", region: "mbz200", recordType: "AAAA" },
    { id: "2a04:4e42:400::99", region: "mbz200", recordType: "AAAA" },
    { id: "2a04:4e42:600::99", region: "mbz200", recordType: "AAAA" },
    {
      id: "d.sni.otherstuff.fastly.net",
      region: "mbz200",
      recordType: "CNAME",
    },
    { id: "w.traffic.cbs.com", region: "custom", recordType: "CNAME" },
  ].forEach((address) => server.create("dns-record", address))

  const dnsRecords = server.schema.dnsRecords.all()

  // tls-configurations
  server.create("tls-configuration", {
    customer: fastlyCustomer,
    default: true,
    dnsRecords,
    httpProtocols: ["http/1.1", "http/2"],
    name: "fastly-a",
    tlsProtocols: ["1.2", "1.3"],
  })

  // In production, fastly has hundreds of tls-configs
  let fastlyTlsConfigs = server.createList("tls-configuration", 157, {
    customer: fastlyCustomer,
    default: false,
    dnsRecords,
  })

  const now = new Date()
  fastlyTlsConfigs.concat(
    server.create("tls-configuration", {
      createdAt: now.setDate(now.getDate() - 7),
      customer: fastlyCustomer,
      dnsRecords,
      name: "FASTLY-LAST-TLS-CONFIG",
    })
  )
}

export default scenario
