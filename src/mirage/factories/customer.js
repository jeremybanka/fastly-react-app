import { Factory } from 'miragejs'
import faker from 'faker'

export default Factory.extend({
  id() {
    return faker.random.alphaNumeric(22)
  },
  name() {
    return faker.company.companyName()
  },
})
