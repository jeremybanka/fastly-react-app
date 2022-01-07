import getDataFromRequest from "../utils/get-data-from-request"

export default function AuthRoutes(server, { origin = "" }) {
  server.get(`${origin}/verify`, function (schema, request) {
    const { customer, user, token } = getDataFromRequest(server, request)

    const features = schema.features.all().models
    let services = null

    /**
     * Service inclusion
     */
    if (request.queryParams.active_services_only) {
      const customerServices = schema.services.where({
        customer_id: customer.id,
      })
      if (customerServices.models) {
        const serviceArray = customerServices.models.map(({ id, name }) => [
          id,
          name,
        ])
        services = Object.fromEntries(serviceArray)
      } else {
        services = {}
      }
    }

    /**
     * Token
     */
    token.update({ updated_at: "new value" })
    localStorage.removeItem("keepTokens")

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
    const userGroups = schema.userGroups.where({ id: user.userGroupIds })
    if (userGroups && userGroups.models && userGroups.models.length) {
      const roles = userGroups.models.reduce(
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
        .filter((perm) => ["account", "internal"].includes(perm.scope))
        .map((perm) => structurePerm(perm))
      const servicePermissions = permissions
        .filter((perm) => perm.scope === "service")
        .map((perm) => structurePerm(perm))
      const authorizedPermissions = {
        account_permissions: accountPermissions.map(({ id }) => id),
        service_permissions: [
          {
            service_id: "all_services",
            permissions: servicePermissions.map(({ id }) => id),
          },
        ],
      }
      response.authorized_permissions = authorizedPermissions
    }

    try {
      // will throw if there is no mirage session serializer, so fall back to response
      return this.serialize(response, "session")
    } catch (e) {
      return response
    }
  })

  server.get(`${origin}/customer-features`)
  server.get(`${origin}/customer-features/:id`)
  server.get(`${origin}/customers`, function (schema, request) {
    const nameFilter = (
      request.queryParams["filter[name][match]"] || ""
    ).toLowerCase()
    return schema.customers.where(
      (c) => c.name && c.name.toLowerCase().includes(nameFilter)
    )
  })
  server.get(`${origin}/customers/:id`, "customer")

  server.get(`${origin}/services`, function (schema, request) {
    const nameFilter = (
      request.queryParams["filter[name][match]"] || ""
    ).toLowerCase()
    if (request.queryParams["filter[domains.name]"] === "oopsie.woopsie.com") {
      return new Response(
        400,
        {},
        { errors: [{ detail: "oh no! something went horribly wrong" }] }
      )
    }
    return schema.services.where((s) =>
      s.name.toLowerCase().includes(nameFilter)
    )
  })

  server.get(`${origin}/current_user/capabilities`, "customer-capability")

  server.get(`${origin}/features`)
  server.get(`${origin}/features/:id`)
}
