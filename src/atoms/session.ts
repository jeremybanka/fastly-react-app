import type { PermissionItem, PermissionObject } from "../typings"
import { atom, selector, selectorFamily } from "recoil"

import Permissions from "../auth/permissions"
import SessionObject from "../auth/session"

const sessionState = atom<SessionObject>({
  key: `session`,
  default: new SessionObject({}).ensureSession({}),
  // should we pass apiOrigin, authPath, and client?
  effects_UNSTABLE: [],
  dangerouslyAllowMutability: true,
})

export const permissionState = selector<PermissionObject | null>({
  key: `permissions`,
  get: async ({ get }) => {
    const session = get(sessionState)
    const permissions = await new Permissions({ session })
    if (session.authorizedPermissions !== null) {
      await permissions.buildCache(session.authorizedPermissions)
      return permissions
    }
    return null
  },
  dangerouslyAllowMutability: true,
})

const featureState = selector<string[] | undefined>({
  key: `features`,
  get: ({ get }) => {
    const session = get(sessionState)
    return session?.features
  },
  dangerouslyAllowMutability: true,
})

export const isOnline = selector({
  key: `isOnline`,
  get: ({ get }) => {
    const online = get(permissionState)
    return online != null
  },
  dangerouslyAllowMutability: true,
})

/**
 * Until Typescript:
 * @param resource: string
 * @param operation: "read" | "write" | "delete" | "crud"
 **/
export const permitted = selectorFamily<boolean | null, PermissionItem>({
  key: `permitted`,
  get: ({ resource, operation, scope }: PermissionItem) => ({ get }) => {
    const permissions = get(permissionState) as PermissionObject | null
    if (permissions == null) return false
    return new Promise((resolve) => {
      if (permissions.has == null) resolve(null) // maybe reject instead?
      resolve(permissions.has(resource, operation, scope))
    })
  },
})

export const isEnabledState = selectorFamily({
  key: `isEnabled`,
  get: (featureName: string) => ({ get }) => {
    const features = get(featureState) as string[]
    return features.includes(featureName)
  },
})

export default sessionState
