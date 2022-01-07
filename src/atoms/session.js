import Permissions from "../auth/permissions"
import Session from "../auth/session"
import { atom } from "recoil"
import featureState from "./features"
import permissionState from "./permissions"
import { useSetRecoilState } from "recoil"

const sessionState = atom({
  key: "session",
  default: null,
  effects_UNSTABLE: [
    async ({ setSelf }) => {
      const setFeatures = useSetRecoilState(featureState)
      const setPermissions = useSetRecoilState(permissionState)

      let session = new Session({}) // should we pass apiOrigin, authPath, and client?
      try {
        console.log("attempting to get session")
        session = await session.ensureSession({}) // should we pass includeServices?
        setSelf(session)
        console.log({ session })
        setFeatures(session.features)
        const permissions = await new Permissions({ session })
        await permissions.buildCache(session.authorizedPermissions)
        setPermissions(permissions)
      } catch (e) {
        console.log("ERROR", e) // Should remove this
        setPermissions({})
      } // auth failure. App will redirect.
    },
  ],
  dangerouslyAllowMutability: true,
})

export default sessionState
