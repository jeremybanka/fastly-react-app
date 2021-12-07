import { useState, useEffect } from "react"
import Session from "../auth/session"

const useSession = (key: string, initialValue: any): [any, Function] => {
  const [session, setSession] = useState(() => {
    return {
      customer: {},
      features: [],
      permissions: {},
      signedIn: false,
      sudoEnabled: null,
      user: {},
      currentCustomerId: null,
      token: {},
      isInternalUser: null,
      userId: null,
    }
  })

  useEffect(() => {
    const session = new Session({})

    async function fetchData() {
      await session.ensureSession({})
      setSession(session)
    }

    fetchData()
  }, [])

  return [session, setSession]
}

export default useSession
