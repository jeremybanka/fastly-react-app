import { Factory } from 'miragejs'

export default Factory.extend({
  name: 'manage.secretcdn-stg.net browser session',
  access_token(i) {
    return `access_token___${i}`
  },
})

