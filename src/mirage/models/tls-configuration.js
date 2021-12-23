import sharedMirage from "shared-mirage"

import { belongsTo, hasMany } from "miragejs"

export default sharedMirage.base.Model.extend({
  customer: belongsTo(),
  dnsRecords: hasMany(),
})

