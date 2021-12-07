import { Model, hasMany } from "miragejs"

export default Model.extend({
  customerFeatures: hasMany(),
})
