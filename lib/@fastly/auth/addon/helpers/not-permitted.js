import { camelize } from '@ember/string'
import Helper from '@ember/component/helper'
import { inject as service } from '@ember/service'

export default class NotPermittedHelper extends Helper {
  @service permissions

  compute(_, args) {
    const formattedArgs = Object.fromEntries(
      Object.entries(args).map(([key, value]) => [camelize(key), value])
    )
    return this.permissions.notPermitted(formattedArgs)
  }
}
