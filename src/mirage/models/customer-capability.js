import { belongsTo } from 'miragejs'
import Model from './base-model'

export default Model.extend({
  customer: belongsTo(),
  invitation: null,
  purge: null,
  service: null,
  stats: null,
  tls: null,
})
