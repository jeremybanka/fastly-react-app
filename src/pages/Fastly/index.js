// @flow

import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

import { Redirect } from "react-router-dom"
import { isEnabledState } from "../../atoms/features"
import { permitted } from "../../atoms/permissions"
import sessionState from "atoms/session"
import { useQuery } from "react-query"
import { useRecoilValue } from "recoil"

type Props = {
  session: any,
}
function FastlyPage(props: Props): React.Node {
  const session = useRecoilValue(sessionState)
  const canReadTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const isExemptFromBilling = useRecoilValue(
    isEnabledState("exemptFromTlsBilling")
  )

  const fetchTlsConfigs = async () => {
    const response = await fetch("/tls/configurations", {
      headers: { "fastly-key": session.token.access_token },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
      throw new Error("Network response was not ok")
    }
    const payload = await response.json()
    console.log({ response })
    return payload.data
  }

  const { isLoading, isError, data, error } = useQuery(
    "tls-configurations",
    fetchTlsConfigs
  )

  if (isLoading) {
    return <span>Loading...</span>
  }
  if (isError) {
    if (error.message === "Unauthorized") {
      return <Redirect to={"/auth"} />
    }
    return <span>Error: {error.message}</span>
  }

  console.log(data)

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
            <ul>
              {data.map((tlsConfiguration) => (
                <li key={tlsConfiguration.id}>
                  {tlsConfiguration.attributes.name}
                </li>
              ))}
            </ul>
          </ul>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default FastlyPage
