import { Factory } from 'ember-cli-mirage'

export default Factory.extend({
  id(n) {
    return `role-${n}`
  },
  custom: false,
})
