import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

import { Link } from "react-router-dom"
import { Redirect } from "react-router-dom"
import { isEnabledState } from "../../atoms/features"
import { permitted } from "../../atoms/permissions"
import { useQuery } from "react-query"
import { useRecoilValue } from "recoil"

function TlsConfigurationsIndex(props) {
  // Auth, permissions, and features
  // ---------------------------------------------------------------------------
  const canReadTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const isExemptFromBilling = useRecoilValue(
    isEnabledState("exemptFromTlsBilling")
  )

  // API call
  // ---------------------------------------------------------------------------
  const fetchTlsConfigs = async () => {
    const response = await fetch("/tls/configurations", {
      headers: { "fastly-key": props.session.token.access_token },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
      throw new Error("Network response was not ok")
    }
    const payload = await response.json()
    return payload.data
  }
  const { isLoading, isError, data, error } = useQuery(
    ["tls-configurations"],
    fetchTlsConfigs
  )

  // What to do while waiting for data-load or error-condition
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <span>Loading...</span>
  }
  if (isError) {
    if (error.message === "Unauthorized") {
      return <Redirect to={"/auth"} />
    }
    return <span>Error: {error.message}</span>
  }

  // Render
  // ---------------------------------------------------------------------------
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
                <Text style={{ whiteSpace: "nowrap" }}>TLS Configurations</Text>
              </Page.Title>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Box maxWidth="400px">
          <h2>Auth</h2>
          <ul>
            <li>User ID: {props.session.user.id}</li>
            <li>Customer ID: {props.session.customer.id}</li>
            <li>
              <strong>Feature-check:</strong> exemptFromTlsBilling:{" "}
              {isExemptFromBilling ? "true" : "false"}
            </li>
            <li>
              <strong>Permission-check:</strong> canReadTls:{" "}
              {canReadTls ? "true" : "false"}
            </li>
          </ul>
        </Box>
        <Box>
          <h2>Data</h2>
          <ul>
            {data.map((tlsConfiguration) => (
              <li key={tlsConfiguration.id}>
                <Link to={`/tls-configurations/${tlsConfiguration.id}`}>
                  {tlsConfiguration.attributes.name}
                </Link>
              </li>
            ))}
          </ul>
        </Box>
      </Page.Body>
    </Page>
  )
}

export default TlsConfigurationsIndex
