import * as React from "react"

// @ts-ignore
import { Box, Flexbox, Page, Text } from "cosmo"
import { queryKeys, useTlsConfig } from "./query"

import { Link } from "react-router-dom"
import { Redirect } from "react-router-dom"
import type { Session } from '../../typings'
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"

type TlsConfigurationDetailsParams = {
  id: string
}

type Props = {
  session: Session
}

function TlsConfigurationDetailsPage(props: Props) {
  // API call
  // ---------------------------------------------------------------------------
  const { id } = useParams<TlsConfigurationDetailsParams>()

  const tlsConfiguration = useQuery(
    queryKeys.detail(id),
    useTlsConfig(id, props.session)
  )

  // What to do while waiting for data-load or error-condition
  // ---------------------------------------------------------------------------
  if (tlsConfiguration.isLoading) {
    return <span>Loading...</span>
  }
  if (tlsConfiguration.error instanceof Error) {
    if (tlsConfiguration.error.message === "Unauthorized") {
      return <Redirect to={"/auth"} />
    }
    return <span>Error: {tlsConfiguration.error.message}</span>
  }
  if (tlsConfiguration.isSuccess === false) return <span>Error</span>

  // Render
  // ---------------------------------------------------------------------------
  const attributes = [
    "bulk",
    "created-at",
    "default",
    "name",
    "service",
    "updated-at",
  ]
  return (
    <Page>
      <Page.Header>
        <Flexbox
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box marginBottom="xs">
            <Page.Title>
              <Text style={{ whiteSpace: "nowrap" }}>
                TLS Configurations Detail
              </Text>
            </Page.Title>
            <Link to="/tls-configurations">Back to TLS Configurations</Link>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <Box>
          <h2>{tlsConfiguration.data.attributes.name}</h2>
          {attributes.map((attribute) => (
            <p key={attribute}>
              {attribute}: {tlsConfiguration.data.attributes[attribute]}
            </p>
          ))}
        </Box>
      </Page.Body>
    </Page>
  )
}

export default TlsConfigurationDetailsPage
