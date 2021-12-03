import { Factory } from 'miragejs'
import faker from 'faker'

export default Factory.extend({
  emailHash: '76ceecc04ee4a5b39c0071b6dfcdda8c',

  login(n) {
    return n === 0 ? 'testadmin@fastly.com' : faker.internet.email()
  },

  name(n) {
    return n === 0 ? 'Test Admin' : `${faker.name.firstName()} ${faker.name.lastName()}`
  },

  role: 'admin',
})
