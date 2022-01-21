import * as React from "react"

import { Box, Page, Text } from "cosmo"

import sessionState from "../../atoms/session"
import { useRecoilValue } from "recoil"

const Login = () => {
  const session = useRecoilValue(sessionState)
  if (session) {
    return (
      <Text>
        User: {session.user.id}
        Customer: {session.customer.id}
      </Text>
    )
  }
  return <p>Not logged in</p>
}

function AuthPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Authentication</Page.Title>
      </Page.Header>
      <Page.Body>
        <Box maxWidth="400px">
          <React.Suspense fallback="LOADING">
            <Login />
          </React.Suspense>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default AuthPage
