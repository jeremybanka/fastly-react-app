import { Model, belongsTo } from "miragejs"

export default Model.extend({
  customer: belongsTo(),
  feature: belongsTo(),
})
