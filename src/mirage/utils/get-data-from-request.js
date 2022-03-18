export default function getDataFromToken(server, request) {
  const accessToken = request.requestHeaders[`fastly-key`]

  const token = server.schema.tokens.findBy({ access_token: accessToken })
  if (!token) {
    console.error(`No token found in database for fastly-key ${accessToken}`)
    return null
  }

  const { customer } = token
  if (!customer) {
    console.error(`No customer found for fastly-key ${accessToken}`)
  }
  const { user } = token
  if (!user) {
    console.error(`No user found for fastly-key ${accessToken}`)
  }
  return { customer, user, token }
}
