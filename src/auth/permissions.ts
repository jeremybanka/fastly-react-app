/* eslint-disable max-lines */

import Session from "./session"

const ALL_SERVICES_SCOPE = `all_services`
const ACCOUNT_SCOPE = `account`
const INTERNAL_SCOPE = `internal`

export type AccountPermissionsType = {
  id: string
  resource: string
  operation: string
  scope: string // account, all_services, or SID
}

type ServicePermissionType = {
  service_id: string
  permissions: string[]
}

export type PermissionCacheType = {
  account_permissions: string[]
  service_permissions: ServicePermissionType[]
}

export default class Permissions {
  session: Session
  permissionModels: AccountPermissionsType[] = []

  /**
   * Holds the cache of permissions
   *
   * This will be populated by buildCache as a single depth array of objects
   * representing the authorized permissions each object contains the permission
   * ID, resource, operation and scope (account, all_services or SID)
   */
  permissionsCache: AccountPermissionsType[] = []

  constructor({ session }: { session: Session }) {
    if (!(session instanceof Session)) {
      throw new Error(`An instance of Session is required`)
    }
    this.session = session
  }

  async getPermissions(): Promise<AccountPermissionsType[]> {
    const response = await this.session.ajax(`/permissions`, {})
    return response.payload ? response.payload.data : response.data
  }

  /**
   * Build out the permissionCache based on the passed in authorizedPermissions.
   * authorizedPermissions are obtained off of the /verify response
   **/
  async buildCache({
    account_permissions: accountPermissions,
    service_permissions: servicePermissions,
  }: PermissionCacheType): Promise<void> {
    let permissions = []
    permissions = await this.getPermissions()
    this.permissionModels = Object.values(permissions)

    this.permissionsCache = [
      ...this._mapPermissions(accountPermissions),
      ...servicePermissions.reduce(
        (object, permission) => [
          ...object,
          ...this._mapPermissions(permission.permissions, permission.service_id),
        ],
        [] as AccountPermissionsType[]
      ),
    ]
  }

  /**
   * Process authorized permissions against the list of all permissions and
   * construct a representation to add to the cache
   */
  _mapPermissions(permissionsToMap: string[], serviceId?: string): AccountPermissionsType[] {
    return permissionsToMap.map((permissionId) => {
      const permission = this.permissionModels.find(({ id }) => id === permissionId)
      if (permission === undefined) throw new Error(`Permission ${permissionId} not found`)

      return {
        id: permissionId,
        resource: permission.resource,
        operation: permission.operation,
        scope: serviceId || permission.scope,
      }
    })
  }

  /**
   * Check the permissionCache for a particular permission
   */
  has(resource: string, operation: string, passedScope: string): boolean {
    const matchedPermission = this.permissionsCache.find(
      ({ resource: r, operation: o }) => resource === r && operation === o
    )

    // does the user have this permission at all?
    if (!matchedPermission) return false
    const { scope: matchedScope } = matchedPermission

    // if checking internal permission, is the user an internal user?
    if (matchedScope === INTERNAL_SCOPE) return this.session.isInternalUser

    // check if the user has this permission on either the account level, all services, or the passed in scope
    return [passedScope, ACCOUNT_SCOPE, ALL_SERVICES_SCOPE].includes(matchedScope)
  }
}
