import { Factory } from 'ember-cli-mirage'

export default Factory.extend({
  id(n) {
    return `user-group-${n}`
  },
  created_at: Date.now(),
  updated_at: Date.now(),
  name(n) {
    return `User Group ${n}`
  },
  description(n) {
    return `This is a text describing the user group ${n}`
  },
})
