import { useState, useEffect } from "react"
import Session from "@fastly/auth"

const useAuth = (key: string, initialValue: any): [any, Function] => {
  const [authData, setAuth] = useState(() => {
    return { loading: true }
  })

  useEffect(() => {
    const session = new Session({})

    async function fetchData() {
      const data = await session.ensureSession({})
      console.log("-=-=-=-", data)
      setAuth({ loading: false })
    }

    fetchData()
  }, [])

  return [authData, setAuth]
}

export default useAuth
