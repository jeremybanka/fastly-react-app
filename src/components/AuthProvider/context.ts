import { createContext } from "react"
import type { Session } from "../../auth/session"

type SessionSetter = (session: Session) => void
type SessionActionType = {
  setSession: SessionSetter
  checkPermissions: (resource: string, operation: string, scope: string) => boolean
  isFeatureEnabled: (featureName: string) => boolean
}
type Context = {
  session: Session
  actions: SessionActionType
}
const AuthContext = createContext({} as Context)

export default AuthContext
