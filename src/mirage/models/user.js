import { belongsTo, hasMany } from "miragejs"

import Model from "./base-model"

export default Model.extend({
  role: null,
  login: null,
  customer: belongsTo(),
  tokens: hasMany(),
})
