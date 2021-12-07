import { Factory } from "miragejs"
import faker from "faker"

const AVAILABILITIES = ["private", "public"]

export default Factory.extend({
  availability() {
    return faker.random.arrayElement(AVAILABILITIES)
  },

  displayName() {
    return faker.commerce.productName()
  },

  enabled: true,

  name() {
    return this.displayName.replaceAll(" ", "_").toLowerCase()
  },
})
