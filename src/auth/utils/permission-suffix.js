import { assert } from '@ember/debug'
import { dasherize } from '@ember/string'
import { singularize } from 'ember-inflector'

const PERMISSION_PROPERTY = /^can([A-Z][a-z]+)([A-Z][a-z]+)?$/

export function isPermissionProperty(propertyName) {
  return PERMISSION_PROPERTY.test(propertyName)
}

/*
 * This function maps an ability property name (e.g. `canReadStats`) to the
 * suffix of a permission (e.g. `stats.read`). It's used by the
 * `customerPermission` and `servicePermission` macros.
 *
 * @protected
 * @see ability:customer
 * @see ability:service
 */
export default function permissionSuffix(propertyName, defaultObject) {
  assert(
    `@fastly/auth/utils/permission-suffix cannot parse ${propertyName}`,
    isPermissionProperty(propertyName)
  )
  let [verb, object] = dasherize(propertyName.replace(/^can/, '')).split('-')
  if (object == null) object = defaultObject
  if (object !== 'stats' && object !== 'tls') object = singularize(object)
  return verb === 'purge' ? `${verb}.${object}` : `${object}.${verb}`
}
