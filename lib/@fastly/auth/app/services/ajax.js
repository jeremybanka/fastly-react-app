import AjaxService from 'ember-ajax/services/ajax'
import AjaxSessionSupport from '@fastly/auth/mixins/ajax-support'

export default AjaxService.extend(AjaxSessionSupport)
