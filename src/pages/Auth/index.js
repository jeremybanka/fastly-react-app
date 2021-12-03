// @flow

import * as React from "react"
import { AuthConfigFastly } from "../../components"
import { Box, Page, Text } from "cosmo"

type Props = {}
function AuthPage(props: Props): React.Node {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Authentication</Page.Title>
      </Page.Header>
      <Page.Body>
        <Box maxWidth="400px">
          <Text fontSize="xl" fontWeight="bold">
            Fastly auth token
          </Text>
          <Box marginBottom="lg" />
          <AuthConfigFastly />
          <Box marginBottom="xxl" />
          <Box marginBottom="lg" />
        </Box>
      </Page.Body>
    </Page>
  )
}

export default AuthPage
