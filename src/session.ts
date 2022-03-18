type Session = {
  user_id?: string
  access_token: string
  expires_at?: number
}

const getSession = (): Session | null => {
  let response = null
  const sessionString = sessionStorage?.getItem(`fastly-auth__session__active-token`)
  if (sessionString) response = JSON.parse(sessionString)
  return response
}

const getAccessToken = (): string | null => {
  let response = null
  const session = getSession()
  if (session) {
    const token = session.access_token
    if (token) {
      const valid = session.expires_at ? new Date(session.expires_at) > new Date() : true
      if (valid) response = token
    }
  }
  return response
}

const getUserId = (): string | null => {
  let response = null
  const session = getSession()
  if (session?.user_id) response = session.user_id
  return response
}

export { getSession, getAccessToken, getUserId }
