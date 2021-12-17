import Session from "../auth/session"
import { atom } from "recoil"
import featureState from "./features"
import { useRecoilState } from "recoil"

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
      const [features, setFeatures] = useRecoilState(featureState)
      const session = new Session({})
      const sessionPromise = session
        .ensureSession({})
        .then((session) => {
          console.log("would like to set features to", session.features)
          try {
            setFeatures(session.features)
          } catch (e) {
            console.log("whoops", e)
          }
          return session
        })
        .catch((err) => {})
      setSelf(sessionPromise)
    },
  ],
  dangerouslyAllowMutability: true,
})

export default sessionState
