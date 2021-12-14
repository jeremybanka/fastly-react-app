import permissions from '@fastly/auth/utils/permissions'

export default function (server) {
  // Create system roles
  // ---------------------------------------------------------------------------
  const { resources } = permissions

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

  // Permissions to trigger failures
  // ---------------------------------------------------------------------------
  const errorTypes = [
    {
      code: 404,
      headers: {
        someHeader: 'hello',
      },
      message: 'this is the message',
    },
  ]

  errorTypes.forEach((errorDetails) => {
    server.create('permission', {
      name: `${errorDetails.code} - ${errorDetails.message}`,
      description: `Trigger a ${errorDetails.code} error`,
      resource_name: 'Errors',
      resource_description: 'Resource description for Errors',
      scope: 'fail',
      errorDetails,
    })
  })
}
