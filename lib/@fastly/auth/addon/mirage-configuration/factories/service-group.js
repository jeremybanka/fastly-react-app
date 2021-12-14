import { Factory } from 'ember-cli-mirage'

export default Factory.extend({
  id(n) {
    return `service-group-${n}`
  },
  created_at: Date.now(),
  updated_at: Date.now(),
})
