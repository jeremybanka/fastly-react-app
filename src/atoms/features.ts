import { atom, selectorFamily } from "recoil"

const featureState = atom({
  key: "features",
  default: [],
})

export const isEnabledState = selectorFamily({
  key: "isEnabled",
  get: (featureName: string) => ({ get }) => {
    const features = get(featureState) as string[]
    return features.includes(featureName)
  },
})

export default featureState
