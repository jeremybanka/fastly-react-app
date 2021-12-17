// @flow

import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

type Props = {
  session: any,
}
function FastlyPage(props: Props): React.Node {
  return (
    <Page>
      <Page.Header>
        <Flexbox
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box marginBottom="xs">
            <Flexbox alignItems="flex-start" flexWrap="wrap" gap="md">
              <Page.Title>
                <Text style={{ whiteSpace: "nowrap" }}>Fastly</Text>
              </Page.Title>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Box maxWidth="400px">
          <Text>
            User: {props.session.user.id} Customer: {props.session.customer.id}
          </Text>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default FastlyPage
