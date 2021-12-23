// @flow

import AuthPage from "./Auth"
import TlsConfigurationsIndexPage from "./TlsConfigurationsPages/index"
import TlsConfigurationsViewPage from "./TlsConfigurationsPages/view"

const TlsConfigurationsPages = {
  Index: TlsConfigurationsIndexPage,
  View: TlsConfigurationsViewPage,
}

export { AuthPage, TlsConfigurationsPages }

