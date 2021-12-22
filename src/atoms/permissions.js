import { atom, selectorFamily } from "recoil"

const permissionState = atom({
  key: "permission",
  default: {},
  dangerouslyAllowMutability: true,
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
      if (permissions.has == null) resolve(false)
      resolve(permissions.has(resource, operation, scope))
    })
  },
})

export default permissionState
