import Model, { attr, hasMany } from '@ember-data/model'

export default class CustomerModel extends Model {
  // Attributes
  // ---------------------------------------------------------------------------
  @attr('string') name

  // Relationships
  // ---------------------------------------------------------------------------
  @hasMany('role') roles
}
