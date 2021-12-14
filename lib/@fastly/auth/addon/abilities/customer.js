import { computed, defineProperty } from '@ember/object'
import permissionSuffix, { isPermissionProperty } from '../utils/permission-suffix'
import { Ability } from 'ember-can'
import { inject as service } from '@ember/service'

export function customerPermission() {
  return computed('model.id', 'session.permissions', function (property) {
    const permissionStore = this.session.permissions
    const customerId = this.model.id
    const permission = permissionSuffix(property, 'customer')
    return permissionStore.has(`customer.${customerId}.${permission}`)
  }).volatile()
}

export default Ability.extend({
  session: service(),

  unknownProperty(propertyName) {
    if (!isPermissionProperty(propertyName)) return undefined
    defineProperty(this, propertyName, customerPermission())
    return this.get(propertyName)
  },
})
