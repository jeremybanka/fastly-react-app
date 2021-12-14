import getDataFromRequest from '../helpers/get-data-from-request'
import itemIsPresentInArray from '@fastly/style-guide/utils/item-is-present-in-array'
import Mirage from 'ember-cli-mirage'

export default function IamRoutes({ server, origin = '' }) {
  // Roles
  // ---------------------------------------------------------------------------
  server.get(`${origin}/roles`, function ({ roles }, request) {
    const { customer } = getDataFromRequest(server, request)
    if (customer) {
      return this.serialize(
        roles.where((role) => role.customer_id === customer.id || role.custom === false)
      )
    } else {
      return this.serialize(roles.all())
    }
  })
  server.post(`${origin}/roles`, function ({ roles }, request) {
    const data = JSON.parse(request.requestBody)
    const { customer } = getDataFromRequest(server, request)
    data.customer_id = customer.id
    const role = roles.create(data)
    return this.serialize(role)
  })
  server.get(`${origin}/roles/:id`)
  server.patch(`${origin}/roles/:id`, function ({ roles }, request) {
    const role = roles.find(request.params['id'])
    const data = JSON.parse(request.requestBody)
    role.update(data)
    role.reload()
    return this.serialize(role)
  })
  server.delete(`${origin}/roles/:id`, function ({ roles }, request) {
    const role = roles.find(request.params['id'])
    if (role.userGroups.length) {
      return new Mirage.Response(
        400,
        {},
        {
          title: 'Your request parameters were invalid.',
          detail: 'The role is in active use and cannot be deleted.',
        }
      )
    }
    return role.destroy()
  })

  // Permissions
  // ---------------------------------------------------------------------------
  server.get(`${origin}/permissions`)
  server.get(`${origin}/roles/:id/permissions`, function ({ roles }, request) {
    return this.serialize(roles.find(request.params['id']).permissions)
  })
  server.post(
    `${origin}/roles/:id/permissions`,
    function ({ roles, permissions: Permissions }, request) {
      const role = roles.find(request.params['id'])
      const { permissions } = JSON.parse(request.requestBody)
      if (!permissions) return this.serialize(role.permissions)
      const doError = permissions
        .map(({ id }) => {
          return Permissions.find(id)
        })
        .filter(({ scope }) => scope === 'fail')
      if (doError.length) {
        const error = doError[0]
        const { code, headers, message } = error.errorDetails
        return new Mirage.Response(code, headers, message)
      }
      const permissionIds = [...role.permissionIds, ...permissions.map(({ id }) => id)]
      role.update({
        permissionIds,
      })
      role.reload()
      return this.serialize(role.permissions)
    }
  )
  server.delete(`${origin}/roles/:id/permissions`, function ({ roles }, request) {
    const role = roles.find(request.params['id'])
    const { permissions: permissionsToDelete } = JSON.parse(request.requestBody)
    const currentIds = role.permissionIds
    const permissionIds = currentIds.filter(
      // filter to existing ids not present in received permissions
      (existingId) => !permissionsToDelete.map(({ id }) => id).includes(existingId)
    )
    role.update({
      permissionIds,
    })
    role.reload()
    return this.serialize(role.permissions)
  })

  // User Groups
  // ---------------------------------------------------------------------------
  server.get(`${origin}/user-groups`, function ({ userGroups }, request) {
    const { customer } = getDataFromRequest(server, request)
    const groups = userGroups.where(function (group) {
      const { user_id, invitation_id } = request.queryParams
      return (
        group.customer_id === customer.id &&
        (!user_id || itemIsPresentInArray({ type: 'user', id: user_id }, group.memberIds)) &&
        (!invitation_id ||
          itemIsPresentInArray({ type: 'invitation', id: invitation_id }, group.memberIds))
      )
    })
    return this.serialize(groups)
  })
  server.post(`${origin}/user-groups/`, function ({ userGroups }, request) {
    const data = JSON.parse(request.requestBody)
    const { customer } = getDataFromRequest(server, request)
    data.customer_id = customer.id
    const userGroup = userGroups.create(data)
    return this.serialize(userGroup)
  })
  server.get(`${origin}/user-groups/:id`)
  server.patch(`${origin}/user-groups/:id`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const data = JSON.parse(request.requestBody)
    userGroup.update(data)
    userGroup.reload()
    return this.serialize(userGroup)
  })
  server.delete(`${origin}/user-groups/:id`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    if (userGroup.members.length) {
      return new Mirage.Response(
        400,
        {},
        {
          title: 'Your request parameters were invalid.',
          detail: 'The user group is in active use and cannot be deleted.',
        }
      )
    }
    return userGroup.destroy()
  })
  server.get(`${origin}/user-groups/:id/members`, function ({ userGroups }, request) {
    return this.serialize(userGroups.find(request.params['id']).members, 'member')
  })
  server.post(`${origin}/user-groups/:id/members`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const { members } = JSON.parse(request.requestBody)
    if (!members) return this.serialize(userGroup.members)
    const memberIds = [
      ...userGroup.memberIds,
      ...members.map(({ id, object }) => {
        return { id, type: object }
      }),
    ]
    userGroup.update({
      memberIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.members, 'member')
  })
  server.delete(`${origin}/user-groups/:id/members`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const { members: membersToDelete } = JSON.parse(request.requestBody)
    if (!membersToDelete) return this.serialize(userGroup.members)
    const currentIds = userGroup.memberIds
    const memberIds = currentIds.filter(
      // filter to existing ids not present in received services
      (existingId) => !membersToDelete.map(({ id }) => id).includes(existingId)
    )
    userGroup.update({
      memberIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.members)
  })
  server.get(`${origin}/user-groups/:id/service-groups`, function ({ userGroups }, request) {
    return this.serialize(userGroups.find(request.params['id']).serviceGroups)
  })
  server.post(`${origin}/user-groups/:id/service-groups`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const serviceGroups = JSON.parse(request.requestBody)['service-groups']
    if (!serviceGroups) return this.serialize(userGroup.serviceGroups)
    const serviceGroupIds = [...userGroup.serviceGroupIds, ...serviceGroups.map(({ id }) => id)]
    userGroup.update({
      serviceGroupIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.serviceGroups, 'iam')
  })
  server.delete(`${origin}/user-groups/:id/service-groups`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const serviceGroupsToDelete = JSON.parse(request.requestBody)['service-groups']
    if (!serviceGroupsToDelete) return this.serialize(userGroup.serviceGroups)
    const currentIds = userGroup.serviceGroupIds
    const serviceGroupIds = currentIds.filter(
      // filter to existing ids not present in received services
      (existingId) => !serviceGroupsToDelete.map(({ id }) => id).includes(existingId)
    )
    userGroup.update({
      serviceGroupIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.serviceGroups)
  })
  server.get(`${origin}/user-groups/:id/roles`, function ({ userGroups }, request) {
    return this.serialize(userGroups.find(request.params['id']).roles)
  })
  server.post(`${origin}/user-groups/:id/roles`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const { roles } = JSON.parse(request.requestBody)
    if (!roles) return this.serialize(userGroup.roles)
    const roleIds = [...userGroup.roleIds, ...roles.map(({ id }) => id)]
    userGroup.update({
      roleIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.roles)
  })
  server.delete(`${origin}/user-groups/:id/roles`, function ({ userGroups }, request) {
    const userGroup = userGroups.find(request.params['id'])
    const { roles: rolesToDelete } = JSON.parse(request.requestBody)
    if (!rolesToDelete) return this.serialize(userGroup.roles)
    const currentIds = userGroup.roleIds
    const roleIds = currentIds.filter(
      // filter to existing ids not present in received services
      (existingId) => !rolesToDelete.map(({ id }) => id).includes(existingId)
    )
    userGroup.update({
      roleIds,
    })
    userGroup.reload()
    return this.serialize(userGroup.roles)
  })

  // Service Groups
  // ---------------------------------------------------------------------------
  server.get(`${origin}/service-groups`, function ({ serviceGroups }, request) {
    const { customer } = getDataFromRequest(server, request)
    const groups = serviceGroups.where({ customer_id: customer.id })
    return this.serialize(groups)
  })
  server.post(`${origin}/service-groups/`, function ({ serviceGroups }, request) {
    const data = JSON.parse(request.requestBody)
    const { customer } = getDataFromRequest(server, request)
    data.customer_id = customer.id
    const serviceGroup = serviceGroups.create(data)
    return this.serialize(serviceGroup)
  })
  server.get(`${origin}/service-groups/:id`)
  server.patch(`${origin}/service-groups/:id`, function ({ serviceGroups }, request) {
    const serviceGroup = serviceGroups.find(request.params['id'])
    const data = JSON.parse(request.requestBody)
    serviceGroup.update(data)
    serviceGroup.reload()
    return this.serialize(serviceGroup)
  })
  server.delete(`${origin}/service-groups/:id`, function ({ serviceGroups }, request) {
    const serviceGroup = serviceGroups.find(request.params['id'])
    if (serviceGroup.userGroups.length) {
      return new Mirage.Response(
        400,
        {},
        {
          title: 'Your request parameters were invalid.',
          detail: 'The service group is in active use and cannot be deleted.',
        }
      )
    }
    return serviceGroup.destroy()
  })
  server.get(`${origin}/service-groups/:id/user-groups`, function ({ serviceGroups }, request) {
    return this.serialize(serviceGroups.find(request.params['id']).userGroups)
  })
  server.get(`${origin}/service-groups/:id/services`, function ({ serviceGroups }, request) {
    return this.serialize(serviceGroups.find(request.params['id']).services, 'iam')
  })
  server.post(`${origin}/service-groups/:id/services`, function ({ serviceGroups }, request) {
    const serviceGroup = serviceGroups.find(request.params['id'])
    const { services } = JSON.parse(request.requestBody)
    if (!services) return this.serialize(serviceGroup.services)
    const serviceIds = [...serviceGroup.serviceIds, ...services.map(({ id }) => id)]
    serviceGroup.update({
      serviceIds,
    })
    serviceGroup.reload()
    return this.serialize(serviceGroup.services, 'iam')
  })
  server.delete(`${origin}/service-groups/:id/services`, function ({ serviceGroups }, request) {
    const serviceGroup = serviceGroups.find(request.params['id'])
    const { services: servicesToDelete } = JSON.parse(request.requestBody)
    if (!servicesToDelete) return this.serialize(serviceGroup.services)
    const currentIds = serviceGroup.serviceIds
    const serviceIds = currentIds.filter(
      // filter to existing ids not present in received services
      (existingId) => !servicesToDelete.map(({ id }) => id).includes(existingId)
    )
    serviceGroup.update({
      serviceIds,
    })
    serviceGroup.reload()
    return this.serialize(serviceGroup.services)
  })
}
