/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CustomerType, MirageServer } from "../../typings"

import { DEFAULT_FEATURES } from "../../utils/features"
import type { Features } from "../../enums"

// mirage
// ---------------------------------------------------------------------------

export default function setupCustomer(
  server: MirageServer,
  featureNames?: Features[],
  customerOverrides = {}
): CustomerType {
  const customer = server.create(`customer`, customerOverrides)

  // TODO: change this over to withTlsManagePermissions and withTlsReadPermissions
  server.create(`customer-capability`, {
    customer,
    tls: [`create`, `delete`, `read`, `update`],
  })

  /*
  // TODO: do we need this?
  server.create('account-customer', {
    id: customer.id,
    financial_status: { billable: true }, //eslint-disable-line
  })
  */

  if (featureNames == null) featureNames = DEFAULT_FEATURES

  featureNames.forEach((featureName) => {
    const feature =
      server.schema.features.find({ name: featureName }) ||
      server.create(`feature`, { name: featureName, availability: `private` })

    feature.update({ enabled: true, availability: `private` }) // why change to private?
    customer.features.models.push(feature)
  })
  customer.save()

  return customer
}
