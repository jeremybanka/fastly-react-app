/**
 * NOTE: This is a temporary solution until we can get the @fast/auth library to
 * properly import into a React project.
 */

enum Scopes {
  customer = `customer`,
  service = `service`,
}

type AttributeType = {
  [key: string]: string
}

type DataType = {
  id: string
}

type RelationshipData = {
  data: DataType
}

type RelationshipType = {
  [Scopes.customer]: RelationshipData
  [Scopes.service]: RelationshipData
}

type CapabilityType = {
  attributes: AttributeType
  type: `customer_capabilities` | `service_capabilities`
  relationships: RelationshipType
}

type StoreType = {
  add: (thing: string) => void
  has: (permission: string) => boolean
}

export type CapabilitiesResponse = {
  data: CapabilityType[]
}

export default class PermissionStore {
  _store: StoreType

  constructor() {
    this._store = new Set()
  }

  /*
   * @param {Object} capabilities, a JSON:API document with an array of
   * capabilities as its primary data
   * @public
   */
  add(json: CapabilitiesResponse): void {
    const capabilities = json.data

    assert(
      `@fastly/auth/permission-store: add expects an Array of capabilities`,
      Array.isArray(capabilities)
    )

    capabilities.forEach((capability: CapabilityType) => {
      const prefix = scope(capability)
      if (!prefix) return

      Object.keys(capability.attributes).forEach((objectType) => {
        const permissions = capability.attributes[objectType]

        if (!Array.isArray(permissions)) return

        permissions.forEach((permission) => {
          this._store.add(`${prefix}.${objectType}.${permission}`)
        })
      })
    })
  }

  /*
   * @param {string} permission, then name of a permission in the form
   * `scopeType.scopeId.object.action`, e.g. `'customer.123abc.service.update'`
   * or `'service.456def.stats.read'`
   * @return {boolean} whether the store has a permission that matches
   */
  has(permission: string): boolean {
    return this._store.has(permission)
  }
}

function assert(message: string, test: boolean) {
  if (!test) {
    throw new Error(message)
  }
}

/* eslint-disable camelcase */
const SCOPE_TYPES = {
  customer_capabilities: Scopes.customer,
  service_capabilities: Scopes.service,
}
/* eslint-enable camelcase */

/* eslint-disable no-console */
function scope(capability: CapabilityType): string | null {
  const { type } = capability

  const scopeType = SCOPE_TYPES[type]
  if (!scopeType) {
    console.warn(`permission-store: no permission scope for capability with type ${type}`)
    return null
  }
  if (capability.relationships == null) return null

  const relationship = capability.relationships[scopeType]
  if (!relationship) {
    console.warn(`permission-store: no relationship of type ${type}`)
    return null
  }

  return `${scopeType}.${relationship.data.id}`
}
