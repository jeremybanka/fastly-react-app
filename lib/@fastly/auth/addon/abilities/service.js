import { computed, defineProperty } from '@ember/object'
import permissionSuffix, { isPermissionProperty } from '../utils/permission-suffix'
import { Ability } from 'ember-can'
import { inject as service } from '@ember/service'

export function servicePermission() {
  return computed('model.{customer.id,id}', 'session.permissions', function (property) {
    const permissionStore = this.session.permissions
    const serviceId = this.model.id
    const customerId = (this.model.customer || {}).id
    const permission = permissionSuffix(property, 'service')
    return (
      permissionStore.has(`service.${serviceId}.${permission}`) ||
      permissionStore.has(`customer.${customerId}.${permission}`)
    )
  }).volatile()
}

export default Ability.extend({
  session: service(),

  unknownProperty(propertyName) {
    if (!isPermissionProperty(propertyName)) return undefined
    defineProperty(this, propertyName, servicePermission())
    return this.get(propertyName)
  },
})
