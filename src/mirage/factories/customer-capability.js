import { Factory } from 'miragejs'

export default Factory.extend({
  customer: null,

  id() {
    const { customer } = this
    if (customer == null || customer.id == null) {
      throw new Error('cannot create a customer-capability without a customer')
    }
    return `someuserid-${customer.id}-capabilities`
  },

  invitation() {
    return []
  },

  purge() {
    return []
  },

  service() {
    return []
  },

  stats() {
    return []
  },

  tls() {
    return []
  },
})
