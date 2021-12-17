import { atom, selectorFamily } from "recoil"

const featureState = atom({
  key: "features",
  default: [],
})

export const isEnabledState = selectorFamily({
  key: "isEnabled",
  get: (featureName) => ({ get }) => {
    const features = get(featureState)
    return features.includes(featureName)
  },
})

export default featureState
