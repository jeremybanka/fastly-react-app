import permissions from '@fastly/auth/utils/permissions'
import roles from '@fastly/auth/utils/predefined-roles'

export function userDarkLaunchData(user, server) {
  const { role, customer } = user
  const userGroupName = `Migrated ${role}`
  let userGroup = server.schema.userGroups.findBy({
    name: userGroupName,
    customer_id: customer.id,
  })
  if (!userGroup) {
    const iamRole = server.schema.roles.findBy({ name: role, customer_id: customer.id })
    userGroup = server.create('user-group', {
      name: userGroupName,
      description: 'Users with limited access',
      customer_id: customer.id,
      roleIds: [iamRole.id],
      userIds: [user.id],
    })
  }
  user.update({
    userGroupIds: [userGroup.id],
  })
}

export function customerDarkLaunchData(customer, server) {
  // Create system roles
  // ---------------------------------------------------------------------------
  const { resources } = permissions
  const { predefinedRoles } = roles

  resources.forEach(
    ({ name: resourceName, description: resourceDescription, resource, operations, scope }) => {
      operations.forEach(({ publicId: id, name, description, operation, public: publicPerm }) => {
        server.create('permission', {
          id,
          name,
          description,
          operation,
          resource,
          resource_name: resourceName,
          resource_description: resourceDescription,
          scope,
          public: publicPerm,
        })
      })
    }
  )

  // create the global user group for all customers in the db
  server.create('user-group', {
    name: 'All users',
    description: 'All users on this account',
    customer_id: customer.id,
  })

  // create the predefined roles for all customers in the db
  predefinedRoles.forEach(({ publicId, role: name, description, permissions: permissionIds }) => {
    server.create('role', {
      publicId,
      name,
      description,
      custom: false,
      customer_id: customer.id,
      permissionIds,
    })
  })

  // create the global service group for all customers in the db
  server.create('service-group', {
    name: 'All services (global)',
    description: 'All services on this account',
    customer_id: customer.id,
    customer,
  })
}
