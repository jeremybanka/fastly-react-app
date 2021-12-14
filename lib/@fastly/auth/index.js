module['exports'] = 
'use strict'

const API_ORIGINS = {
  development: 'http://api.dev.local',
  production: 'https://api.fastly.com',
  test: 'https://api.fastly.test',
}

module.exports = {
  name: '@fastly/auth',

  config(environment, appConfig) {
    const addonConfig = appConfig['fastly-auth'] || {}

    addonConfig.apiOrigin =
      addonConfig.apiOrigin ||
      process.env.FASTLY_API_ORIGIN ||
      API_ORIGINS[environment] ||
      API_ORIGINS.production

    addonConfig.authPath = addonConfig.authPath || process.env.FASTLY_AUTH_PATH

    addonConfig.client = addonConfig.client || `${appConfig.APP.name} ${appConfig.APP.version}`

    return { 'fastly-auth': addonConfig }
  },
}
