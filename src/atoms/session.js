import Permissions from "../auth/permissions"
import Session from "../auth/session"
import { atom } from "recoil"
import featureState from "./features"
import permissionState from "./permissions"
import { useSetRecoilState } from "recoil"

const sessionState = atom({
  key: "session",
  default: {
    customer: { id: "M4H...", name: "fastly" },
    features: [],
    permissions: {},
    signedIn: false,
    sudoEnabled: null,
    user: { id: "123", name: "joe" },
    currentCustomerId: null,
    token: {},
    isInternalUser: null,
    userId: null,
  },
  effects_UNSTABLE: [
    async ({ setSelf }) => {
      const setFeatures = useSetRecoilState(featureState)
      const setPermissions = useSetRecoilState(permissionState)

      let session = new Session({})
      try {
        session = await session.ensureSession({})
        setFeatures(session.features)
        const permissions = await new Permissions({ session })
        await permissions.buildCache(session.authorizedPermissions)
        setPermissions(permissions)
        setSelf(session)
      } catch (e) {} // auth failure. App will redirect.
    },
  ],
  dangerouslyAllowMutability: true,
})

export default sessionState
