import Session from "./session"

const ALL_SERVICES_SCOPE = "all_services"
const ACCOUNT_SCOPE = "account"
const INTERNAL_SCOPE = "internal"

export default class Permissions {
  constructor({ session }) {
    if (!(session instanceof Session)) {
      throw new Error("An instance of Session is required")
    }
    this.session = session
  }

  /**
   * Holds the cache of permissions
   *
   * This will be populated by buildCache as a single depth array of objects representing the authorized permissions
   * each object contains the permission ID, resource, operation and scope (account, all_services or SID)
   */
  permissionsCache = []

  async getPermissions() {
    const response = await this.session.ajax("/permissions")
    return response.payload ? response.payload.data : response.data
  }

  /**
   * Build out the permissionCache based on the passed in authorizedPermissions. authorizedPermissions are obtained off of the /verify response
   *
   * @param {Object} authorizedPermissions - an object containing the account and service level permissions granted
   * @param {Sting[]} authorizedPermissions.account_permissions - an array of account scoped permissions IDs
   * @param {Object[]} authorizedPermissions.service_permissions - an array of objects containing service scoped permissions and service ids
   * @param {String} authorizedPermissions.service_permissions[].service_id - a service ID or all_services
   * @param {String[]} authorizedPermissions.service_permissions[].permissions - an array of service scoped permission IDs that pertain to the service_id
   */
  async buildCache({
    account_permissions: accountPermissions,
    service_permissions: servicePermissions,
  }) {
    let permissions = []
    permissions = await this.getPermissions()
    this.permissionModels = Object.values(permissions)

    this.permissionsCache = [
      ...this._mapPermissions(accountPermissions),
      ...servicePermissions.reduce(
        (object, permission) => [
          ...object,
          ...this._mapPermissions(
            permission.permissions,
            permission.service_id
          ),
        ],
        []
      ),
    ]
  }

  // NOTE: THIS HAD TO BE MODIFIED FROM THE EMBER VERSION
  /**
   * Process authorized permissions against the list of all permissions and construct a representation to add to the cache
   *
   * @param {Object[]} permissionsToMap an array of permissions
   * @param {String} serviceId - either an SID or all_services, otherwise not provided
   * @returns {Object[]} an array containing representations of the permissionsToMap and their scope
   */
  _mapPermissions(permissionsToMap, serviceId = null) {
    return permissionsToMap.map((permissionId) => {
      const permission = this.permissionModels.find(
        ({ id }) => id === permissionId
      )

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
   *
   * @param {String} resource - the resource of the permission being checked
   * @param {String} operation - the operation of the permission being checked
   * @param {*} passedScope - the scope (typically an SID, can be all_services or account for explicity) of the permission being checked
   * @returns {Boolean} - true = permission is granted || false = permission is not granted
   */
  has(resource, operation, passedScope) {
    const matchedPermission = this.permissionsCache.find(
      ({ resource: r, operation: o }) => resource === r && operation === o
    )

    // does the user have this permission at all?
    if (!matchedPermission) return false
    const { scope: matchedScope } = matchedPermission

    // if checking internal permission, is the user an internal user?
    if (matchedScope === INTERNAL_SCOPE) return this.session.isInternalUser()

    // check if the user has this permission on either the account level, all services, or the passed in scope
    return [passedScope, ACCOUNT_SCOPE, ALL_SERVICES_SCOPE].includes(
      matchedScope
    )
  }
}
