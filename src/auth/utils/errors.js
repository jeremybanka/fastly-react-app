// TODO: Update AuthError and extensions to ES6
export function AuthError(payload, message = 'Auth failed') {
  this.payload = payload
  this.status = 400
}

export function OtpSetupError() {
  AuthError.call(this, '2FA Setup Required')
}
OtpSetupError.prototype = Object.create(AuthError.prototype)

export function PasswordRotateError() {
  AuthError.call(this, 'Password needs to be rotated')
}
PasswordRotateError.prototype = Object.create(AuthError.prototype)

export function SsoRecommendedError() {
  AuthError.call(this, 'SSO is the recommended auth path')
}
SsoRecommendedError.prototype = Object.create(AuthError.prototype)

export class OperationError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

export class RelationshipSaveError extends OperationError {
  constructor(id, errors) {
    super('Error saving relationships')
    this.modelId = id
    this.capturedErrors = errors
  }
}

export class PrimarySaveError extends OperationError {
  constructor(id, primaryError, relationshipErrors) {
    super('Error saving primary record')
    this.modelId = id
    this.primaryError = primaryError.payload || primaryError
    this.capturedRelationshipErrors = relationshipErrors
  }
}
