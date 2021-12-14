import getDataFromRequest from '../helpers/get-data-from-request'

export default function AuthRoutes({ server, origin = '' }) {
  server.get(`${origin}/verify`, function (schema, request) {
    const { customer, user, token } = getDataFromRequest(server, request)

    const features = schema.features.all().models
    let services = null

    /**
     * Service inclusion
     */
    if (request.queryParams.active_services_only) {
      const customerServices = schema.services.where({ customer_id: customer.id })
      if (customerServices.models) {
        const serviceArray = customerServices.models.map(({ id, name }) => [id, name])
        services = Object.fromEntries(serviceArray)
      } else {
        services = {}
      }
    }

    /**
     * Token
     */
    token.update({ updated_at: 'new value' })
    localStorage.removeItem('keepTokens')

    const response = {
      customer,
      user,
      features: features.map((f) => f.name),
      token: token.attrs,
      services,
    }

    /**
     * Permissions
     */
    const userGroups = user.userGroups?.models
    if (userGroups?.length) {
      const roles = userGroups.reduce(
        (roles, userGroup) => [...roles, ...userGroup.roles.models],
        []
      )
      const permissions = roles.map((role) => {
        return role.permissions.models
      })[0]

      const structurePerm = function ({ id, name, operation, resource }) {
        return { id, name, operation, resource }
      }
      const accountPermissions = permissions
        .filter((perm) => ['account', 'internal'].includes(perm.scope))
        .map((perm) => structurePerm(perm))
      const servicePermissions = permissions
        .filter((perm) => perm.scope === 'service')
        .map((perm) => structurePerm(perm))
      const authorizedPermissions = {
        account_permissions: accountPermissions.map(({ id }) => id),
        service_permissions: [
          {
            service_id: 'all_services',
            permissions: servicePermissions.map(({ id }) => id),
          },
        ],
      }
      response.authorized_permissions = authorizedPermissions
    }

    try {
      // will throw if there is no mirage session serializer, so fall back to response
      return this.serialize(response, 'session')
    } catch (e) {
      return response
    }
  })
}
