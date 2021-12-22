import { Model, belongsTo, hasMany } from "miragejs"

export default Model.extend({
  customer: belongsTo(),
  dnsRecords: hasMany(),
})

