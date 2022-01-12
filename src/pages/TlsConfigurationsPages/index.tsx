import * as React from "react"

// @ts-ignore
import { Box, Flexbox, Page, Text } from "cosmo"
import { queryKeys, useTlsConfigs } from "./queryKeys"

import { Link } from "react-router-dom"
import { Redirect } from "react-router-dom"
import type { Session } from '../../typings'
import type { TlsConfiguration } from "./queryKeys"
import { isEnabledState } from "../../atoms/features"
import { permitted } from "../../atoms/permissions"
import { useQuery } from "react-query"
import { useRecoilValue } from "recoil"

type Props = {
  session: Session
}

function TlsConfigurationsIndex(props: Props) {
  // permissions and features
  // ---------------------------------------------------------------------------
  const canReadTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const isExemptFromBilling = useRecoilValue(isEnabledState("exemptFromTlsBilling"))

  // API call
  // ---------------------------------------------------------------------------
  const tlsConfigurations = useQuery(queryKeys.all, useTlsConfigs(props.session))

  // What to do while waiting for data-load or error-condition
  // ---------------------------------------------------------------------------
  if (tlsConfigurations.isLoading) {
    return <span>Loading...</span>
  }
  if (tlsConfigurations.error instanceof Error) {
    if (tlsConfigurations.error.message === "Unauthorized") {
      return <Redirect to={"/auth"} />
    }
    return <span>Error: {tlsConfigurations.error.message}</span>
  }
  if (tlsConfigurations.isSuccess === false) return <span>Error</span>

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
            <li data-testid={`user-${props.session.user.id}`}>
              User: ID: {props.session.user.id} | login:{" "}
              {props.session.user.login} | role: {props.session.user.role}
            </li>
            <li>Customer ID: {props.session.customer.id}</li>
            <li data-testid="feature-check">
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
            {tlsConfigurations.data.map((tlsConfiguration: TlsConfiguration) => (
              <li key={tlsConfiguration.id}>
                <Link
                  data-testid={tlsConfiguration.id}
                  to={`/tls-configurations/${tlsConfiguration.id}`}
                >
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
