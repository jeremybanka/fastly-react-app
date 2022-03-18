import * as React from "react"

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Box, Page, Text } from "cosmo"

import { AuthConfigFastly } from "../../components"
import useAuth from "../../components/AuthProvider/use"

const ShowUserInfo = () => {
  const { session } = useAuth()
  if (session.user == null) {
    return <AuthConfigFastly />
  }

  return (
    <Text>
      User: {session.user.id}
      Customer: {session.customer?.id}
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
          <ShowUserInfo />
        </Box>
      </Page.Body>
    </Page>
  )
}

export default AuthPage
