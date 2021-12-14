import Component from '@ember/component'
import { computed } from '@ember/object'
import { guidFor } from '@ember/object/internals'
import hbs from 'htmlbars-inline-precompile'

export default Component.extend({
  // Passed Properties
  // ---------------------------------------------------------------------------
  label: '',
  // Internal properties
  // ---------------------------------------------------------------------------
  tagName: '',
  inputId: computed(function () {
    return 'input-' + guidFor(this)
  }),

  layout: hbs`
    <div class='fui-auth-screen__input-group' aria-describedby={{tooltipId}}>
      <label class='fui-auth-screen__input-group-label flex-row margin-top--m margin-bottom--s' for={{inputId}}>
        {{label}}
        {{yield (hash contextual-link=(component 'yield'))}}
      </label>
      <Input @class='fui-input authentication__sign-in-input margin-top--s' @value={{value}} ...attributes id={{inputId}} />
    </div>
  `,
})
