import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'
import { inject as service } from '@ember/service'

export default Component.extend({
  // Services
  // ---------------------------------------------------------------------------
  router: service(),

  // Internal Properties
  // ---------------------------------------------------------------------------
  tagName: '',

  // Methods
  // ---------------------------------------------------------------------------
  cancel() {
    this.router.location.history.back()
  },

  // Template
  // ---------------------------------------------------------------------------

  layout: hbs`
    <div class='flex-row flex-row--hcenter text-align--center'>
      <div class='fui-card padding--l margin-top--xl'>
        <div class='fui-auth-screen__overlay'>
          <div class='fui-auth-screen__panel'>
            <FuiIcon @name='fastly-logo-red' @class='fastly-logo-red' />
            {{yield}}
            <button class='fui-auth-form__button cancel margin-top--m' {{action cancel}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
