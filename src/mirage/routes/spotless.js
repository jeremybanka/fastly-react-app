import { FASTLY_CUSTOMER_ID } from "../../auth/session"
import { Response } from "miragejs"

function getCustomerId(request, tokens) {
  const tokenName = request.requestHeaders[`fastly-key`]
  const userTokens = tokens.where({ access_token: tokenName }).models
  if (userTokens.length === 0) {
    return null
  }
  return userTokens[0].customerId
}

export default function SpotlessRoutes(server) {
  server.get(`/tls/configurations`, function (schema, request) {
    let customerId = getCustomerId(request, schema.tokens)
    if (customerId == null) {
      return new Response(401, {}, { msg: `Unauthorized` })
    }

    if (customerId === FASTLY_CUSTOMER_ID) {
      const idFromQueryParams = request.queryParams[`filter[customer.id]`]
      customerId = idFromQueryParams ? idFromQueryParams : customerId
    }

    return schema.tlsConfigurations.where({ customerId })
  })

  server.get(`/tls/configurations/:id`, `tls-configuration`)
}
