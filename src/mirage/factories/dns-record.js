import { Factory } from "miragejs"
import faker from "faker"

export default Factory.extend({
  region() {
    return faker.random.arrayElement([`mbz100`, `global`, `mbz200`])
  },

  recordType: `A`,
})
