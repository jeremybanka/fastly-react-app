// @flow

import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

import { isEnabledState } from "../../atoms/features"
import { permitted } from "../../atoms/permissions"
import { useRecoilValue } from "recoil"

type Props = {
  session: any,
}
function FastlyPage(props: Props): React.Node {
  const canReadTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const isExemptFromBilling = useRecoilValue(
    isEnabledState("exemptFromTlsBilling")
  )
  console.log({ canReadTls })

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
          <ul>
            <li>User: {props.session.user.id}</li>
            <li>Customer: {props.session.customer.id}</li>
            <li>
              exemptFromTlsBilling: {isExemptFromBilling ? "true" : "false"}
            </li>
            <li>canReadTls: {canReadTls ? "true" : "false"}</li>
          </ul>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default FastlyPage
