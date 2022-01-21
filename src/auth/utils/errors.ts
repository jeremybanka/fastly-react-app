/**
 * NOTE: This is a temporary solution until we can get the @fast/auth library to
 * properly import into a React project.
 */

// TODO: Update AuthError and extensions to ES6
// export function AuthError(payload, message = "Auth failed") {
//   this.payload = payload
//   this.status = 400
// }
export class AuthError extends Error {
  payload: string
  status: number

  constructor(payload: string, message = `Auth failed`) {
    super(message)
    this.payload = payload
    this.message = message
    this.status = 400
  }
}

export class OtpSetupError extends AuthError {
  constructor(message = `2FA Setup Required`) {
    super(message)
  }
}

export class PasswordRotateError extends AuthError {
  constructor(message = `Password needs to be rotated`) {
    super(message)
  }
}

export class SsoRecommendedError extends AuthError {
  constructor(message = `SSO is the recommended auth path`) {
    super(message)
  }
}

// export function OtpSetupError() {
//   AuthError.call(this, "2FA Setup Required")
// }
// OtpSetupError.prototype = Object.create(AuthError.prototype)

// export function PasswordRotateError() {
//   AuthError.call(this, "Password needs to be rotated")
// }
// PasswordRotateError.prototype = Object.create(AuthError.prototype)

// export function SsoRecommendedError() {
//   AuthError.call(this, "SSO is the recommended auth path")
// }
// SsoRecommendedError.prototype = Object.create(AuthError.prototype)

export class OperationError extends Error {
  modelId?: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === `function`) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

export class RelationshipSaveError extends OperationError {
  capturedErrors: string[]
  constructor(id: string, errors: string[]) {
    super(`Error saving relationships`)
    this.modelId = id
    this.capturedErrors = errors
  }
}

export class PrimarySaveError extends OperationError {
  modelId: string
  primaryError: string | AuthError
  capturedRelationshipErrors: string[]
  constructor(id: string, primaryError: AuthError, relationshipErrors: string[]) {
    super(`Error saving primary record`)
    this.modelId = id
    this.primaryError = primaryError.payload || primaryError
    this.capturedRelationshipErrors = relationshipErrors
  }
}
