import React, { useState, useEffect } from "react"
import AuthContext from "./context"
import type { Session } from "../../auth/session"
import { emptyPermission, buildCache, has } from "../../auth/permissions"
import { emptySession, ensureSession } from "../../auth/session"

const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [session, setSession] = useState(Object.assign({}, emptySession))
  const [permissions, setPermissions] = useState(emptyPermission)

  useEffect(() => {
    ensureSession(session)
      .then((newSession: Session) => {
        if (newSession.authorizedPermissions !== null) {
          buildCache(newSession, permissions).then((newPermissions) => {
            setPermissions(newPermissions)
            setSession(() => newSession)
          })
        } else {
          setSession(() => newSession)
        }
      })
      .catch((error) => {
        console.log(`error`, error)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkPermissions = (resource: string, operation: string, scope: string): boolean => {
    if (permissions == null) return false
    if (has(permissions, resource, operation, scope) == null) return false
    return has(permissions, resource, operation, scope)
  }

  const isFeatureEnabled = (feature: string): boolean => {
    const features = session?.features || []
    return features.includes(feature)
  }

  const value = {
    session,
    permissions,
    actions: { setSession, checkPermissions, isFeatureEnabled },
  }

  // TODO: could also render loading spinner
  if (session.settled == false) return null
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
