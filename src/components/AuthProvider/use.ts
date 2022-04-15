import AuthContext from "./context"
import { useContext } from "react"

function useAuth() {
  return useContext(AuthContext)
}

export default useAuth
