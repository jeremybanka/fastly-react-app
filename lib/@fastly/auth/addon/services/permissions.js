import Service, { inject as service } from '@ember/service'

export default class PermittedService extends Service {
  @service can
  @service features // only used to check for RBAC Enforcement
  @service session

  permitted(args) {
    if (this.features.get('enforce_enhanced_rbac')) {
      const { resource, operation, scope } = args
      // this is the temp fall back for areas that we have not implemented eRBAC
      if (resource && operation) {
        return this.session.getPermissionCache().has(resource, operation, scope)
      }
    }
    // remove enhanced rbac parameters if user is not using them
    delete args.resource
    delete args.operation
    delete args.scope
    // perform legacy check
    const { legacyAbility, legacyModel, legacyInternalCheckRole, ...additionalProperties } = args
    if (legacyInternalCheckRole) {
      return ['internal', 'salesadmin', 'admin'].includes(this.session.user?.role)
    }
    return this.can.can(legacyAbility, legacyModel, additionalProperties)
  }

  notPermitted() {
    return !this.permitted(...arguments)
  }
}
