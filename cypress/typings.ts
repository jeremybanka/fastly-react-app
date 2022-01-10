// mirage
// ---------------------------------------------------------------------------

type Callback = (schema: Schema, request: Request) => any
type ModelOrFunction = Callback | string
type FixAnyPlease = any

export type MirageServer = {
  namespace: string
  urlPrefix: string
  passthrough: (path?: string) => void
  get: (path: string, arg?: ModelOrFunction) => void
  post: (path: string, arg?: ModelOrFunction) => void
  patch: (path: string, arg?: ModelOrFunction) => void
  del: (path: string, arg?: ModelOrFunction) => void
  db: Db
  create: (
    modelName: string,
    arg1?: FixAnyPlease,
    options?: FixAnyPlease
  ) => any
  createList: (modelName: string, count: number, options?: FixAnyPlease) => any
  session: FixAnyPlease
  schema: Schema
}

type AnyObject = Record<string, unknown>

export type MirageObject = {
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
