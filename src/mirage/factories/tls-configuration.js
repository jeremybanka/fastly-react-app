import { DateTime } from "luxon"
import { Factory } from "miragejs"
import faker from "faker"

export default Factory.extend({
  createdAt: () => DateTime.utc().minus({ week: 48 }).toJSDate(),
  default: false,
  name: () => `tls-configuration-${faker.commerce.productName()}`,
  bulk: false,
  service: null,
})
