import * as React from "react"

import { isOnline, permitted } from "../atoms/permissions"

import { Redirect } from "react-router-dom"
import sessionState from "../atoms/session"
import { useRecoilValue } from "recoil"

type Props = {
  render: (session: any) => JSX.Element,
}

const UserData = (props: Props) => {
  const session = useRecoilValue(sessionState)
  const permissionsLoaded = useRecoilValue(isOnline)
  const canManageTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const canReadTls = useRecoilValue(
    permitted({ resource: "tls", operation: "crud", scope: "account" })
  )
  const noTlsPermissions = !canManageTls && !canReadTls

  if (permissionsLoaded === false) return null

  if (session == null || noTlsPermissions) {
    return <Redirect to={"/auth"} />
  }
  return props.render(session)
}

function EnsureAuth(props: Props) {
  return (
    <React.Suspense fallback="">
      <UserData render={props.render} />
    </React.Suspense>
  )
}

export default EnsureAuth
