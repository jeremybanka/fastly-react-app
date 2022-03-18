/* eslint-disable max-lines */

import type { Session } from "./session"
import { ajax, isInternalUser } from "./session"

const ALL_SERVICES_SCOPE = `all_services`
const ACCOUNT_SCOPE = `account`
const INTERNAL_SCOPE = `internal`

export type AccountPermissionsType = {
  id?: string
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

export type PermissionsType = {
  session: Session | null
  permissionModels: AccountPermissionsType[]
  permissionsCache: AccountPermissionsType[]
}

export const emptyPermission: PermissionsType = {
  session: null,
  permissionModels: [],
  /**
   * Holds the cache of permissions
   *
   * This will be populated by buildCache as a single depth array of objects
   * representing the authorized permissions each object contains the permission
   * ID, resource, operation and scope (account, all_services or SID)
   */
  permissionsCache: [],
}

export const getPermissions = async (session: Session): Promise<AccountPermissionsType[]> => {
  const response = await ajax(session, `/permissions`, {})
  return response.data
}

/**
 * Build out the permissionCache based on the passed in authorizedPermissions.
 * authorizedPermissions are obtained off of the /verify response
 **/
export const buildCache = async (
  session: Session,
  permissions: PermissionsType
): Promise<PermissionsType> => {
  let result = []
  result = await getPermissions(session)
  const accountPermissions = session.authorizedPermissions?.account_permissions || []
  const servicePermissions = session.authorizedPermissions?.service_permissions || []
  const permissionModels = Object.values(result)
  const permissionsCache = [
    ..._mapPermissions(permissionModels, accountPermissions),
    ...servicePermissions.reduce(
      (object, p) => [
        ...object,
        ..._mapPermissions(permissionModels, p.permissions, p.service_id),
      ],
      [] as AccountPermissionsType[]
    ),
  ]

  const newPermission = Object.assign({}, permissions, {
    permissionModels,
    permissionsCache,
  })
  return newPermission
}

/**
 * Process authorized permissions against the list of all permissions and
 * construct a representation to add to the cache
 */
const _mapPermissions = (
  permissionModels: AccountPermissionsType[],
  permissionsToMap: string[],
  serviceId?: string
): AccountPermissionsType[] => {
  return permissionsToMap.map((permissionId) => {
    const permission = permissionModels.find(({ id }) => id === permissionId)
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
export const has = (
  permission: PermissionsType,
  resource: string,
  operation: string,
  passedScope: string
): boolean => {
  const matchedPermission = permission.permissionsCache.find(
    ({ resource: r, operation: o }) => resource === r && operation === o
  )

  // does the user have this permission at all?
  if (!matchedPermission) return false
  const { scope: matchedScope } = matchedPermission

  if (permission?.session) {
    // if checking internal permission, is the user an internal user?
    if (matchedScope === INTERNAL_SCOPE) return isInternalUser(permission.session)
  }

  // check if the user has this permission on either the account level, all services, or the passed in scope
  return [passedScope, ACCOUNT_SCOPE, ALL_SERVICES_SCOPE].includes(matchedScope)
}
