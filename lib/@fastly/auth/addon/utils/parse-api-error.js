import { get } from '@ember/object'

// Accepts an Ember-AJAX Errors object that was created from one of the
// following JSON response payloads:
//
// JSON-API
// { errors: [ { detail: '...' } ] }
//
// Legacy Errors Hash
// { errors: { some_property: ['...'] }
//
// Legacy Single Named Error
// { some_property: '...' }
//
// Legacy detail
// { detail: '...' }
//
// Legacy msg
// { msg: '...' }
export default function (error, legacyApiErrorKey = 'detail', defaultError = 'Error with request') {
  // Re-parsing a parsed error:
  if (error.hasOwnProperty('type') && error.hasOwnProperty('body')) return error

  const errorMessages = parseErrorMessages(error, legacyApiErrorKey)

  if (errorMessages.length === 0) {
    errorMessages.push(defaultError)
  }

  return { type: 'error', body: errorMessages.join(', ') }
}

function parseErrorMessages(error, legacyApiErrorKey) {
  return findErrors(error, legacyApiErrorKey).map((e) => messageFromError(e))
}

function findErrors(error, legacyApiErrorKey) {
  if (typeof error.detail === 'string') return [error.detail]

  const errorKey = [
    'detail',
    'msg',
    `payload.errors.${legacyApiErrorKey}`,
    `payload.${legacyApiErrorKey}`,
    'payload.errors',
    'payload.detail', // classic error fallback to `detail` in legacy api
    'payload.msg',
    'payload',
  ].find((key) => get(error, key))

  const result = errorKey ? get(error, errorKey) : []

  return Array.isArray(result) ? result : [result]
}

function messageFromError(e) {
  return e.detail || `${e}`
}
