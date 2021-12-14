import Model, { attr, belongsTo } from '@ember-data/model'
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

/** The account model is used in this library to represent the new many to many
relationship between the user and the customer; a third model is used since the
user-belongs-to-customer relationship cannot be altered at this time. The account
model duplicates the customer model in every way except in it's relationship to
user and represents the data returned from /accounts. An account's primary id is
a customer id **/

export default Model.extend({
  session: service(),
  name: attr('string'),
  user: belongsTo(),
  defaultAccount: attr(),

  currentSession: computed('id', 'session.{customer.id,token}', function () {
    return this.id === this.session.customer.id
  }),
})
