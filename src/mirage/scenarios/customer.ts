import { DEFAULT_FEATURES } from "../../utils/features"
import { Features } from "../../enums"

// mirage
// ---------------------------------------------------------------------------

type Callback = (schema: Schema, request: Request) => any
type ModelOrFunction = Callback | string
type FixAnyPlease = any

export interface MirageServer {
  namespace: string
  urlPrefix: string
  passthrough: (path?: string) => void
  get: (path: string, arg?: ModelOrFunction) => void
  post: (path: string, arg?: ModelOrFunction) => void
  patch: (path: string, arg?: ModelOrFunction) => void
  del: (path: string, arg?: ModelOrFunction) => void
  db: Db
  create: (modelName: string, options?: FixAnyPlease) => any
  createList: (modelName: string, count: number, options?: FixAnyPlease) => any
  schema: Schema
}

type AnyObject = Record<string, unknown>

interface MirageObject {
  all: () => any
  attrs: any
  create: (arg0: any) => any
  find: (arg0: AnyObject) => any
  findBy: (arg0: AnyObject) => any
  findOrCreateBy: (arg0: AnyObject) => any
  first: any
  length: number
  new: any
  update: (arg0: any) => any
  where: (arg0: AnyObject) => any
}

interface DbInterface {
  find: (arg0: AnyObject) => any
  remove: () => void
}

interface Db {
  customers: DbInterface
  tlsCertificates: DbInterface
  tlsActivations: DbInterface
  tlsDomains: DbInterface
}

export interface Schema {
  customerCapabilities: MirageObject
  customers: MirageObject
  db: Db
  dnsRecords: MirageObject
  features: MirageObject
  globalsignEmailChallenges: MirageObject
  tokens: MirageObject
  tlsActivations: MirageObject
  tlsAuthorizations: MirageObject
  tlsCertificates: MirageObject
  tlsConfigurations: MirageObject
  tlsDomains: MirageObject
  tlsPrivateKeys: MirageObject
  tlsSubscriptions: MirageObject
  services: MirageObject
  users: MirageObject
}

export default function setupCustomer(
  server: MirageServer,
  featureNames?: Features[],
  customerOverrides = {}
): FixAnyPlease {
  const customer = server.create("customer", customerOverrides)

  // TODO: change this over to withTlsManagePermissions and withTlsReadPermissions
  server.create("customer-capability", {
    customer,
    tls: ["create", "delete", "read", "update"],
  })

  /*
  // TODO: do we need this?
  server.create('account-customer', {
    id: customer.id,
    financial_status: { billable: true }, //eslint-disable-line
  })
  */

  if (featureNames == null) featureNames = DEFAULT_FEATURES

  featureNames.forEach((featureName) => {
    const feature =
      server.schema.features.find({ name: featureName }) ||
      server.create("feature", { name: featureName, availability: "private" })

    feature.update({ enabled: true, availability: "private" }) // why change to private?
    customer.features.models.push(feature)
  })
  customer.save()

  return customer
}
