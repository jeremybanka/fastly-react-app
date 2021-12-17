// @flow

import * as React from "react"

import { Box, Flexbox, Page, Text } from "cosmo"

import sessionState from "../../hooks/useSession"
// import { useParams, Redirect } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"

// import { RequestRejected } from "../../components"
// import { Verify } from "../../resources/fastly/verify"


const UserData = () => {
  const session = useRecoilValue(sessionState)

  return (
    <p>
      LOADING: {session.user.id} {session.customer.id}
    </p>
  )
}

type Props = {}
function FastlyPage(props: Props): React.Node {
  const params = useParams()

  const { serviceId } = params

  if (!serviceId) {
    /*
    return (
      <Verify query={{ active_services_only: true }}>
        {(rsrc) => {
          const { state } = rsrc

          if (state.rejected)
            return <RequestRejected reason={state.reason.message} />
          if (state.pending) return null

          const { services } = state.value

          const serviceIds = Object.keys(services)

          if (serviceIds.length === 0)
            return <RequestRejected reason="No services found for this user" />

          return <Redirect to={`/fastly/${serviceIds[0]}`} />
        }}
      </Verify>
    )
    */
  }

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
              <React.Suspense fallback="LOADING">
                <UserData />
              </React.Suspense>
            </Flexbox>
          </Box>
        </Flexbox>
      </Page.Header>
      <Page.Body>
        <p>Hello world</p>
      </Page.Body>
    </Page>
  )
}

export default FastlyPage
