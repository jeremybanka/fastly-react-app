import Model, { attr } from '@ember-data/model'

export default class ServiceModel extends Model {
  // Attributes
  // ---------------------------------------------------------------------------
  @attr('string') name
  @attr('string') type
  @attr('date') createdAt
  @attr('date') updatedAt
}
