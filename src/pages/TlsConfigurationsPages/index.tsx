/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Box, Flexbox, Page, Text } from "cosmo"
import { Link, Redirect } from "react-router-dom"
import useAuth from "../../components/AuthProvider/use"

import type { FC } from "react"
import type { TlsConfiguration } from "./query"
import { useTlsConfigs } from "./query"

const TlsConfigurationsIndex: FC = () => {
  // Model
  // ---------------------------------------------------------------------------
  const { session, actions } = useAuth()
  const tlsConfigurations = useTlsConfigs(session)

  // permissions and features
  // ---------------------------------------------------------------------------
  const canReadTls = actions.checkPermissions(`tls`, `crud`, `account`)
  const isExemptFromBilling = actions.isFeatureEnabled(`exemptFromTlsBilling`)
  if (canReadTls == false) return <Redirect to="/auth/sign-in" />

  // What to do while waiting for data-load or error-condition
  // ---------------------------------------------------------------------------
  if (tlsConfigurations.isLoading) {
    return <span>Loading...</span>
  }
  if (tlsConfigurations.error instanceof Error) {
    if (tlsConfigurations.error.message === `Unauthorized`) {
      return <Redirect to={`/auth/sign-in`} />
    }
    return <span>Error: {tlsConfigurations.error.message}</span>
  }
  if (tlsConfigurations.isSuccess === false) return <span>Error</span>

  if (session == null) return null
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Page>
      <Page.Header>
        <Flexbox alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
          <Box marginBottom="xs">
            <Flexbox alignItems="flex-start" flexWrap="wrap" gap="md">
              <Page.Title>
                <Text style={{ whiteSpace: `nowrap` }}>TLS Configurations</Text>
              </Page.Title>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Box maxWidth="400px">
          <h2>Auth</h2>
          <ul>
            <li data-testid={`user-${session?.user?.id}`}>
              User: ID: {session?.user?.id} | login: {session?.user?.login} | role:{` `}
              {session?.user?.role}
            </li>
            <li>Customer ID: {session?.customer?.id}</li>
            <li data-testid="feature-check">
              <strong>Feature-check:</strong> exemptFromTlsBilling:{` `}
              {isExemptFromBilling ? `true` : `false`}
            </li>
            <li>
              <strong>Permission-check:</strong> canReadTls: {canReadTls ? `true` : `false`}
            </li>
          </ul>
        </Box>
        <Box>
          <h2>Data</h2>
          <ul>
            {tlsConfigurations?.data?.map((tlsConfiguration: TlsConfiguration) => (
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
