// @flow

import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

import { Link } from "react-router-dom"
import { Redirect } from "react-router-dom"
import sessionState from "atoms/session"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import { useRecoilValue } from "recoil"

type Props = {
  session: any,
}
function TlsConfigurationDetailsPage(props: Props): React.Node {
  // Auth, permissions, and features
  // ---------------------------------------------------------------------------
  const session = useRecoilValue(sessionState)

  // API call
  // ---------------------------------------------------------------------------
  const { id } = useParams()

  const fetchTlsConfigs = async () => {
    const response = await fetch(`/tls/configurations/${id}`, {
      headers: { "fastly-key": session.token.access_token },
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
    ["tls-configurations", id],
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
          <h2>{data.attributes.name}</h2>
          {attributes.map((attribute) => (
            <p key={attribute}>
              {attribute}: {data.attributes[attribute]}
            </p>
          ))}
        </Box>
      </Page.Body>
    </Page>
  )
}

export default TlsConfigurationDetailsPage
