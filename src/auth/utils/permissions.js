const permissions = {
  resources: [
    {
      resource: "customer-services",
      name: "Customer Services",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Read/View service config data (customer)",
          description: "Read/View service config data (customer)",
          publicId: "56UrjseT24H50MKsii7Sku",
          operation: "read",
          public: false,
        },
        {
          name: "Create/Update service config data (customer)",
          description: "Create/Update service config data (customer)",
          publicId: "r448JRjo0V30m6uiBURZd",
          operation: "update",
          public: false,
        },
        {
          name: "Cloning/moving services",
          description: "Cloning/moving services",
          publicId: "1ZrNNoA4WagHZbnJYQmrG3",
          operation: "transfer",
          public: false,
        },
      ],
    },
    {
      resource: "admin-ui",
      name: "Admin UI",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Access Admin UI",
          description: "Access Admin UI",
          publicId: "5lFQDT5hec2cPxLHESdF6y",
          operation: "read",
          public: false,
        },
      ],
    },
    {
      resource: "feature-flags",
      name: "Feature Flags",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Read/View Feature Flags",
          description: "Read/View Feature Flags",
          publicId: "2XKyi3yNFbOmpYflpMGn8H",
          operation: "read",
          public: false,
        },
        {
          name: "Create Feature Flag",
          description: "Create Feature Flag",
          publicId: "3rqjOT6i6ch28kdqdPZwV5",
          operation: "write",
          public: false,
        },
        {
          name: "Update Feature Flag",
          description: "Update Feature Flag",
          publicId: "6l3WPRHHmI4OX63UEyjhIo",
          operation: "update",
          public: false,
        },
        {
          name: "Delete Feature Flag",
          description: "Delete Feature Flag",
          publicId: "1ug7xuhlTVaMZE5MP9h3zU",
          operation: "delete",
          public: false,
        },
        {
          name: "Add Customer to Feature Flag",
          description: "Add Customer to Feature Flag",
          publicId: "AqKoOMiNjehbWJeuNRXuP",
          operation: "manage",
          public: false,
        },
      ],
    },
    {
      resource: "admin-tools",
      name: "Admin Tools",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Use VCL Mass Updater",
          description: "Use the VCL Mass Updater available in Admin UI",
          publicId: "7e6u4LyX2HrE3BpmkbfCCC",
          operation: "vcl",
          public: false,
        },
        {
          name: "Use TLS Tools",
          description: "Use the TLS Tools available in the Admin UI",
          publicId: "b6lq3rnmvsUugVxoSqrLY",
          operation: "tls",
          public: false,
        },
        {
          name: "Admin Bar",
          description: "View and use the Admin Bar within the UI",
          publicId: "6vallIPfpTaAHaMyc2goJC",
          operation: "admin-bar",
          public: false,
        },
      ],
    },
    {
      resource: "customer-users",
      name: "Customer Users",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "View user details",
          description: "View user data",
          publicId: "7UDLSvQdyiviPC65IpeWWB",
          operation: "read",
          public: false,
        },
        {
          name: "Delete user",
          description: "Delete user on customer",
          publicId: "3YgHcAz7ryVkcUqjz7GL1D",
          operation: "delete",
          public: false,
        },
        {
          name: "Administrative actions on user (reset password, reset 2fa)",
          description:
            "Administrative actions on user (reset password, reset 2fa)",
          publicId: "49Y2QwzW5Tk1BB3voAeCuf",
          operation: "manage",
          public: false,
        },
      ],
    },
    {
      resource: "service-limits",
      name: "Service Limits",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Update service limits",
          description: "Update service limits",
          publicId: "5m9mXcI1PiRRIVcL4bF3Cm",
          operation: "update",
          public: false,
        },
      ],
    },
    {
      resource: "customer-limits",
      name: "Customer Limits",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Update customer limits",
          description: "Update customer limits",
          publicId: "35YZGRveZRWZJ84bPIR3g4",
          operation: "update",
          public: false,
        },
      ],
    },
    {
      resource: "customer-options",
      name: "Customer Options",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Update customer options",
          description: "Update customer options",
          publicId: "5TtTBKRj8MPSU2NO58FgCw",
          operation: "update",
          public: false,
        },
      ],
    },
    {
      resource: "purge-customer-data",
      name: "Purge Customer Data",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Purge by url",
          description: "Purge custoemr data by url",
          publicId: "53KJct8XEmnGJfg22OkNeJ",
          operation: "url",
          public: false,
        },
        {
          name: "Purge by key",
          description: "Purge customer data by key",
          publicId: "5z1avyFeE3ArE4OrrNi7Bi",
          operation: "key",
          public: false,
        },
        {
          name: "Purge all",
          description: "Purge all customer data",
          publicId: "27ZefIzTV8fdFpthsOWnLJ",
          operation: "all",
          public: false,
        },
      ],
    },
    {
      resource: "customer-records",
      name: "Customer Records",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Update customer record",
          description: "Update customer record",
          publicId: "1D5dOdJhI1Frgy4AanXfVk",
          operation: "update",
          public: false,
        },
        {
          name: "Delete customer record",
          description: "Delete customer record",
          publicId: "48qWtcoeaxBv9k2Ktmf1cu",
          operation: "delete",
          public: false,
        },
        {
          name: "View all customer data (read-only)",
          description: "View all customer data (read-only)",
          publicId: "4FDW8lyhAPkhsmPXxGhFVh",
          operation: "read",
          public: false,
        },
        {
          name: "Activate/deactivate a Service",
          description: "Activate or deactivate a customer service",
          publicId: "5HRQRHEjjZUQtrOp7X1Kby",
          operation: "deploy",
          public: false,
        },
      ],
    },
    {
      resource: "account-actions",
      name: "Account Actions",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "Account Shutdowns",
          description: "Account Shutdowns",
          publicId: "7gAFL3tqApXr8r0ZgZXTSX",
          operation: "shutdown",
          public: false,
        },
      ],
    },
    {
      resource: "customer-tls",
      name: "Customer TLS",
      description: "Fastly (internal)",
      scope: "internal",
      operations: [
        {
          name: "View/Read customer certificates",
          description: "View/Read customer certificates",
          publicId: "5CkJmnhZidW1xQHb6OVclI",
          operation: "read",
          public: false,
        },
        {
          name: "Create/Update customer certificates",
          description: "Create/Update customer certificates",
          publicId: "6mD3Z9Fa6uH6VGgas4Yzys",
          operation: "update",
          public: false,
        },
        {
          name: "Delete customer certificates",
          description: "Delete customer certificates",
          publicId: "6AgzSKf4syYGtmVPD0Eq9r",
          operation: "delete",
          public: false,
        },
      ],
    },
    {
      resource: "billing",
      name: "Billing",
      description: "Billing",
      scope: "account",
      operations: [
        {
          name: "View invoices",
          description: "Allow user to view current and past invoices",
          operation: "read",
          publicId: "7VPGK0JPL2TucN5yandyYi",
          public: true,
        },
        {
          name: "Manage payment info",
          description: "Allow user to update credit card info to pay bills",
          operation: "crud",
          publicId: "6niNUxMWXDvd51bcLNvZGM",
          public: true,
        },
        {
          name: "Change account type",
          description:
            "Allow user to change account type to developer or paying",
          operation: "update",
          publicId: "5ogdX7n1fJG8mFNqgJawhQ",
          public: true,
        },
      ],
    },
    {
      resource: "tls",
      name: "Transport Layer Security (TLS)",
      description:
        "Secure and manage domains added to your services using your own certificates or one procured by Fastly.",
      scope: "account",
      operations: [
        {
          name: "view TLS",
          operation: "read",
          description: "Read only access to Fastly TLS",
          publicId: "4CdH3KXHlLKbrvSq7OejPC",
          public: true,
        },
        {
          name: "view, edit, manage TLS",
          operation: "crud",
          description: "Read, Update, and Destroy Fastly TLS Configuration",
          publicId: "3punJagi47QaT3S643pdX2",
          public: true,
        },
      ],
    },
    {
      resource: "metrics",
      name: "Metrics",
      description:
        "Fastly offers a variety of ways to report on the performance and activity of your services.",
      scope: "account",
      operations: [
        {
          name: "Read real-time metrics",
          operation: "read-real-time",
          description: "Allow user to read real-time metrics",
          publicId: "3xf9v9RQ71C81OooWLSycH",
          public: true,
        },
        {
          name: "Read historical metrics",
          operation: "read-historical",
          description: "Allow user to read historical metrics",
          publicId: "5EsBoch416OAcxUJ1wdWzo",
          public: true,
        },
      ],
    },
    {
      resource: "real-time-logging",
      name: "Real-time logging",
      description:
        "Stream logs to a variety of locations, including third-party services, for storage and analysis.",
      scope: "service",
      operations: [
        {
          name: "View logging endpoints",
          operation: "read",
          description: "Allow user to read logging endpoints",
          publicId: "5bS7xMiH7nbsaeAQfSSfFV",
          public: true,
        },
        {
          name: "View, edit, manage logging endpoints",
          operation: "crud",
          description:
            "Ability to Create, Read, Update, and Destroy logging endpoints",
          publicId: "lms5Fua5bE9idcVpJxF7F",
          public: true,
        },
      ],
    },
    {
      resource: "edge-rate-limiting",
      name: "Edge Rate Limiting",
      description: "Permissions for Edge Rate Limiting Policies",
      scope: "service",
      operations: [
        {
          name: "create edge rate limiting policy",
          description: "Create new edge rate limiting policies",
          operation: "create",
          publicId: "2qUSelVHDUjTgE1ajZqAEy",
          public: true,
        },
        {
          name: "view edge rate limiting policy",
          description: "View edge rate limiting policies",
          operation: "read",
          publicId: "70iAuKsUGRYcbqGxmgm0o7",
          public: true,
        },
        {
          name: "update edge rate limiting policy",
          description: "Update edge rate limiting policies",
          operation: "update",
          publicId: "5oe0TFmCEbQAxGBAoG4rlG",
          public: true,
        },
        {
          name: "delete edge rate limiting policy",
          description: "Delete edge rate limiting policies",
          operation: "delete",
          publicId: "SIak2pfCbZNiByd6n0Qp6",
          public: true,
        },
      ],
    },
    {
      resource: "compute-service",
      name: "Compute@Edge Wasm service",
      description: "Wasm Service permissions for a user",
      scope: "service",
      operations: [
        {
          name: "Create Wasm Service",
          description: "Allows users to create a new Wasm service",
          operation: "create",
          publicId: "SDoxaUi4OH8u2Jv5cJqcA",
          public: true,
        },
        {
          name: "View Wasm Service",
          description:
            "Allow user to view all configurations and stats of an existing Wasm service",
          operation: "read",
          publicId: "5PWKFIm70jdqJCxrqUXzsf",
          public: true,
        },
        {
          name: "Edit/clone Wasm Service",
          description:
            "Allow user to edit an existing Wasm service, which requires a clone operation",
          operation: "update",
          publicId: "2mFUkBJbLdtNEepYUcqvvo",
          public: true,
        },
        {
          name: "Delete Wasm Service",
          description: "Allow user to delete an existing Wasm service",
          operation: "delete",
          publicId: "7YFoqX26lkZB2iBJn0YnZ0",
          public: true,
        },
        {
          name: "Activate/Deactivate Wasm Service",
          description:
            "Allow user to Activate or Deactivate an existing Wasm service",
          operation: "deploy",
          publicId: "4SEv6jjJX6mdb4Ldw07Ls9",
          public: true,
        },
      ],
    },
    {
      resource: "compute-log-tailing",
      name: "Compute@Edge Log Tailing",
      description:
        "Log Tailing, stream log messages locally to your Fastly CLI",
      scope: "service",
      operations: [
        {
          name: "Create Log Tailing endpoint",
          description:
            "Allows users to create Log Tailing endpoint (handled behind the scenes by EventBuffer)",
          operation: "create",
          publicId: "4HOgG45f5Tg1Q6YPqNxIeD",
          public: true,
        },
        {
          name: "View Log Tailing endpoint",
          description:
            "Allow user to view all logs streamed to Lot Tailing endpoint",
          operation: "read",
          publicId: "L9YiIhUdHiXugOF3vlDYj",
          public: true,
        },
        {
          name: "Update Log Tailing endpoint",
          description:
            "User are not allowed to edit Lot Tailing managed endpoint",
          operation: "update",
          publicId: "70tnLQDXGk7cY6qbnPZENh",
          public: true,
        },
        {
          name: "Delete Log Tailing endpoint",
          description:
            "Allow user to delete an Log Tailing endpoint (handled behind the scenes by EventBuffer, similar to deactivating the endpoint",
          operation: "delete",
          publicId: "14HZvkSpEDB8WoioMaQ2N2",
          public: true,
        },
        {
          name: "Activate/Deactivate Log Tailing endpoint",
          description:
            "Allow user to Activate or Deactivate the Log Tailing endpoint",
          operation: "deploy",
          publicId: "4wx3w5RrvXuuduAVKCFCtW",
          public: true,
        },
      ],
    },
    {
      resource: "company-settings",
      name: "Company Settings",
      description: "Manage company settings",
      scope: "account",
      operations: [
        {
          name: "Manage company settings",
          description: "Allow user to modify company setttings",
          operation: "update",
          publicId: "4LVjdyrW6ws2emJP6AzLiV",
          public: true,
        },
        {
          name: "Manage sensitive company settings",
          description: "Allow user to enable/disable company-wide 2FA",
          operation: "manage",
          publicId: "4pHMe4U1aK37fB9KSYdkwE",
          public: true,
        },
      ],
    },
    {
      resource: "iam",
      name: "IAM Settings",
      description: "Manage IAM role based authorization controls (rbac)",
      scope: "account",
      operations: [
        {
          name: "Add roles, service groups, and user groups",
          description:
            "Allow user to add new roles, service groups, and user groups",
          operation: "create",
          publicId: "62Ob1TnIvbX80pNfys4D6Y",
          public: true,
        },
        {
          name: "Update roles, service groups, and user groups",
          description:
            "Allow user to assign and change roles, service groups, and user groups",
          operation: "update",
          publicId: "5RBqmpjtCJS0PTQqu5XUMY",
          public: true,
        },
        {
          name: "Delete roles, service groups, and user groups",
          description:
            "Allow user to delete roles, service groups, and user groups",
          operation: "delete",
          publicId: "3vCXDQpcr3EuweHrSyWKVo",
          public: true,
        },
      ],
    },
    {
      resource: "users",
      name: "Users",
      description: "Manage users",
      scope: "account",
      operations: [
        {
          name: "Create user",
          description: "Allow user to create and invite new users",
          operation: "create",
          publicId: "7Tupfn6s3C1zALZGvvAozj",
          public: true,
        },
        {
          name: "Update user",
          description: "Allow user to create and invite new users",
          operation: "update",
          publicId: "2Be1MVr5FjINEJXuREqpK0",
          public: true,
        },
        {
          name: "Delete user",
          description: "Allow user to delete users",
          operation: "delete",
          publicId: "1EpnHCgemZDbcpAenZLKzo",
          public: true,
        },
      ],
    },
    {
      resource: "personal-tokens",
      name: "Personal API Tokens",
      description: "Manage personal API tokens",
      scope: "account",
      operations: [
        {
          name: "Add personal API token",
          description: "Allow user to add a personal API token",
          operation: "create",
          publicId: "1HeQbPrVe3pMeZVmZ29nRS",
          public: true,
        },
        {
          name: "Delete personal API token",
          description: "Allow user to delete a personal API token",
          operation: "delete",
          publicId: "37mTZFHzqcm397Rmkd3VSb",
          public: true,
        },
      ],
    },
    {
      resource: "services",
      name: "Services",
      description: "Configuration of services.",
      scope: "service",
      operations: [
        {
          name: "View service configurations",
          description: "Read only access to service configurations",
          operation: "read",
          publicId: "5nBMOvEPb4AQVT0ZIdz0r1",
          public: true,
        },
        {
          name: "Create services",
          description: "Access for creating new services",
          operation: "create",
          publicId: "2hC2sMbC0OEj0MEDAzwz4v",
          public: true,
        },
        {
          name: "Activate/Deactivate services",
          description: "Access for activating and deactivating services",
          operation: "deploy",
          publicId: "HCditBqYiCdP54TDmxdKJ",
          public: true,
        },
        {
          name: "Delete services",
          description: "Access for deleting services",
          operation: "delete",
          publicId: "4lswsEAGxADpRsn4sJ34jR",
          public: true,
        },
        {
          name: "Configure services",
          description:
            "Access for configuring services, including their versionless data structures such as Edge Dictionaries and Access Control Lists",
          operation: "write",
          publicId: "5r2WThu04gj44wNba1HPNa",
          public: true,
        },
        {
          name: "Compare service versions",
          description:
            "Access to compare differences between two service versions",
          operation: "compare",
          publicId: "6e6WJP6mU33rFuZ6UMns7w",
          public: true,
        },
      ],
    },
    {
      resource: "purge",
      name: "Purge",
      description: "Purge cached data",
      scope: "service",
      operations: [
        {
          name: "Purge",
          description:
            "Access to remove, or mark as stale, a service's objects from Fastly caches.",
          operation: "manage",
          publicId: "1UiBJblABIQc92IWA74bt4",
          public: true,
        },
      ],
    },
    {
      resource: "service-vcl",
      name: "Service VCL",
      description: "Manage VCL for a Service",
      scope: "service",
      operations: [
        {
          name: "View and download VCL",
          description:
            "Access to view and download the service's Varnish Configuration Language (VCL) configuration file(s)",
          operation: "read",
          publicId: "7mufIgnWO5B3Y7eXWSWvyS",
          public: true,
        },
        {
          name: "Customize VCL",
          description: "Access to upload custom VCL to a service.",
          operation: "write",
          publicId: "6bOCnPeEGpnwOohLId5Etc",
          public: true,
        },
      ],
    },
  ],
}

export default permissions
