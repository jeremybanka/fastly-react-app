import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'

export default Component.extend({
  tagName: '',
  layout: hbs`{{yield}}`,
})
