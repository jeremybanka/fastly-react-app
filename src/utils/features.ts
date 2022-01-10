import { Features } from "../enums"

// TODO: Add some process.env checking for default features
export const ALL_FEATURES = [
  Features.darkMode,
  Features.exemptFromTlsBilling,
  Features.keyAndCertRotation,
  Features.rateLimiting,
  Features.tlsKeysPage,
  Features.secureAtEdge,
  Features.waf,
  Features.wafUi,
]

export const DEFAULT_FEATURES: Features[] = []

// These are features that cannot be turned off
export const MANDATORY_FEATURES: Features[] = []
