import Session from "../auth/session"
import { atom } from "recoil"

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
    ({ setSelf }) => {
      const session = new Session({})
      const sessionPromise = session.ensureSession({})
      setSelf(sessionPromise)
    },
  ],
  dangerouslyAllowMutability: true,
})

export default sessionState
