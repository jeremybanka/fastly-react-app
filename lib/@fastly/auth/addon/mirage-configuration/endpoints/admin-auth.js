import getDataFromRequest from '../helpers/get-data-from-request'
import { Response } from 'ember-cli-mirage'

const FASTLY_CUSTOMER_ID = 'M4HCwJxJPGCIBSlRd5ETh'

export default function AdminAuthRoutes({ server, origin = '' }) {
  server.post(`${origin}/admin/breakglass`, function (schema, request) {
    const { customer, user, token } = getDataFromRequest(server, request)

    const attrs = request.requestBody
    if (customer.id !== FASTLY_CUSTOMER_ID) {
      return new Response(404, 'not found')
    }

    if (!token.sudo_expires_at) {
      return new Response(
        400,
        {},
        {
          msg: 'Call /saml/sudo first',
        }
      )
    }

    const padding = attrs.admin_role_expires_at * 60 * 60 * 1000
    const adminRoleExpiresAt = new Date(Date.now() + padding).toISOString()
    user.update({
      admin_role_expires_at: adminRoleExpiresAt,
      role: 'admin',
    })
    return { status: 'ok' }
  })
}
