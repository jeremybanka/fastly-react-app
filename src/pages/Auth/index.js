import * as React from "react"

import { Box, Page, Text } from "cosmo"

import { AuthConfigFastly } from "../../components"
import sessionState from "../../atoms/session"
import { useRecoilValue } from "recoil"

const ShowUserInfo = () => {
  const session = useRecoilValue(sessionState)
  if (session.user == null) {
    return <AuthConfigFastly />
  }

  return (
    <Text>
      User: {session.user.id}
      Customer: {session.customer.id}
    </Text>
  )
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
            <ShowUserInfo />
          </React.Suspense>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default AuthPage
