import { atom, selector, selectorFamily } from "recoil"

const permissionState = atom({
  key: "permission",
  default: null,
  dangerouslyAllowMutability: true,
})

export const isOnline = selector({
  key: "isOnline",
  get: ({ get }) => {
    const online = get(permissionState)
    return online != null
  },
})

/**
 * Until Typescript:
 * @param resource: string
 * @param operation: "read" | "write" | "delete" | "crud"
 **/
export const permitted = selectorFamily({
  key: "permitted",
  get: ({ resource, operation, scope }) => ({ get }) => {
    const permissions = get(permissionState)
    return new Promise((resolve, reject) => {
      if (permissions.has == null) resolve(null)
      resolve(permissions.has(resource, operation, scope))
    })
  },
})

export default permissionState
