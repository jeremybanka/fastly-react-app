import * as React from "react"

import sessionState, { permitted } from "../atoms/session"

import type { FC } from "react"
import { Redirect } from "react-router-dom"
import { useRecoilValue } from "recoil"

const UserData: FC = ({ children }) => {
  const session = useRecoilValue(sessionState)
  const canManageTls = useRecoilValue(
    permitted({ resource: `tls`, operation: `crud`, scope: `account` })
  )
  const canReadTls = useRecoilValue(
    permitted({ resource: `tls`, operation: `crud`, scope: `account` })
  )
  const noTlsPermissions = !canManageTls && !canReadTls

  if (session == null || noTlsPermissions) {
    return <Redirect to={`/auth`} />
  }
  return <>{children}</>
}

const EnsureAuth: FC = ({ children }) => {
  return (
    <>
      <React.Suspense fallback="">
        <UserData>{children}</UserData>
      </React.Suspense>
    </>
  )
}

export default EnsureAuth
