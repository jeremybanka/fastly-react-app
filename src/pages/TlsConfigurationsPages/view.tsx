import * as React from "react"

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Box, Flexbox, Page, Text } from "cosmo"
import { Link, Redirect, useParams } from "react-router-dom"

import type { FC } from "react"
import sessionState from "../../atoms/session"
import { useRecoilValue } from "recoil"
import { useTlsConfig } from "./query"

type TlsConfigurationDetailsParams = {
  id: string
}

const TlsConfigurationDetailsPage: FC = () => {
  // Model
  // ---------------------------------------------------------------------------
  const { id } = useParams<TlsConfigurationDetailsParams>()
  const session = useRecoilValue(sessionState)
  const tlsConfiguration = useTlsConfig(id, session)

  // What to do while waiting for data-load or error-condition
  // ---------------------------------------------------------------------------
  if (tlsConfiguration.isLoading) {
    return <span>Loading...</span>
  }
  if (tlsConfiguration.error instanceof Error) {
    if (tlsConfiguration.error.message === `Unauthorized`) {
      return <Redirect to={`/auth/sign-in`} />
    }
    return <span>Error: {tlsConfiguration.error.message}</span>
  }
  if (tlsConfiguration.isSuccess === false) return <span>Error</span>

  // Render
  // ---------------------------------------------------------------------------
  const attributes = [`bulk`, `created-at`, `default`, `name`, `service`, `updated-at`]
  return (
    <Page>
      <Page.Header>
        <Flexbox alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
          <Box marginBottom="xs">
            <Page.Title>
              <Text style={{ whiteSpace: `nowrap` }}>TLS Configurations Detail</Text>
            </Page.Title>
            <Link to="/tls-configurations">Back to TLS Configurations</Link>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Box>
          <h2>{tlsConfiguration?.data?.attributes?.name}</h2>
          {attributes.map((attribute) => (
            <p key={attribute}>
              {attribute}: {tlsConfiguration?.data?.attributes[attribute]}
            </p>
          ))}
        </Box>
      </Page.Body>
    </Page>
  )
}

export default TlsConfigurationDetailsPage
