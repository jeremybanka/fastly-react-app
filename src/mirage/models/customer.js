import Model from "./base-model"
// import { hasMany } from "miragejs"

export default Model.extend({
  // customerCapabilities: hasMany(),
  // features: hasMany(),
  name: null,
  // services: hasMany(),

  /*
  // TODO: move to @fastly/auth
  enabledFeatureNames() {
    // TODO: deal with public features too; but we don't have any with snowcat
    return this.features.models.map(m => m.name)
  },
  */
})
