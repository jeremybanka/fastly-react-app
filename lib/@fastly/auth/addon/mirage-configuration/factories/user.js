import { Factory, trait } from 'ember-cli-mirage'
import permissions from '@fastly/auth/utils/permissions'

const { resources } = permissions
const {
  resource,
  scope,
  name: resource_name,
  description: resource_description,
  operations: tlsOperations,
} = resources.find(({ resource }) => resource === 'tls')
const { publicId: manageOperationId, ...tlsManageOperation } = tlsOperations.find(
  ({ operation }) => operation === 'crud'
)
const { publicId: viewOperationId, ...tlsViewOperation } = tlsOperations.find(
  ({ operation }) => operation === 'read'
)
console.log({ tlsManageOperation, tlsViewOperation })
export default Factory.extend({
  withTlsManagePermissions: trait({
    afterCreate(user, server) {
      const permission = server.create('permission', {
        id: manageOperationId,
        resource_name,
        resource,
        resource_description,
        scope,
        ...tlsManageOperation,
      })

      const { customer, id: userId } = user

      const role = server.create('role', {
        name: 'TLS Engineer',
        description: 'Manage TLS',
        custom: false,
        customer_id: customer.id,
        permissionIds: [permission.id],
      })

      const userGroup = server.create('user-group', {
        name: 'TLS Engineers',
        description: 'Engineers with manage TLS permission',
        customer_id: customer.id,
        roleIds: [role.id],
        userIds: [userId],
      })

      user.update({
        userGroupIds: [userGroup.id],
      })
    },
  }),

  withTlsReadPermissions: trait({
    afterCreate(user, server) {
      const permission = server.create('permission', {
        id: viewOperationId,
        resource_name,
        resource,
        resource_description,
        scope,
        ...tlsViewOperation,
      })

      const { customer, id: userId } = user

      const role = server.create('role', {
        name: 'TLS Engineer (read only)',
        description: 'Read TLS',
        custom: false,
        customer_id: customer.id,
        permissionIds: [permission.id],
      })

      const userGroup = server.create('user-group', {
        name: 'TLS Engineers (read only)',
        description: 'Engineers with read TLS permission',
        customer_id: customer.id,
        roleIds: [role.id],
        userIds: [userId],
      })

      user.update({
        userGroupIds: [userGroup.id],
      })
    },
  }),
})
