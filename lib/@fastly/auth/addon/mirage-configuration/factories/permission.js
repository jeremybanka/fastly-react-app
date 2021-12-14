import { Factory } from 'ember-cli-mirage'

export default Factory.extend({
  id(n) {
    return `perm-${n}`
  },

  description(n) {
    return `Description ${n} for ${this.resource_name} permission`
  },

  operation(n) {
    const possibleOperatiions = ['read', 'update', 'delete']
    return possibleOperatiions[n % possibleOperatiions.length]
  },
})
