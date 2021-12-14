import Component from '@ember/component'
import hbs from 'htmlbars-inline-precompile'

export default Component.extend({
  tagName: '',
  errorText: 'An error occured. Try again or ',
  linkText: 'Contact support',
  link: 'https://www.fastly.com/support',
  class: 'margin-bottom--m',
  dismissible: false,
  layout: hbs`
    <FuiMessage
      @type='error'
      @class='text-align--left {{class}}'
      @dismissible={{dismissible}}
    >
      <p role='alert' ...attributes >
        {{errorText}} <ExternalLinkTo
          @text={{linkText}}
          @href={{link}}
        />.
      </p>
    </FuiMessage>
  `,

  didInsertElement() {
    this._super(...arguments)
    const overlay = document.querySelector('.fui-auth-screen__overlay')
    if (overlay) {
      overlay.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  },
})
