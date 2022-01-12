import AuthPage from "./Auth"
import TlsConfigurationsIndexPage from "./TlsConfigurationsPages/index"
import TlsConfigurationsViewPage from "./TlsConfigurationsPages/view"
import PostIndexPage from "./PostPages/index"
import PostViewPage from "./PostPages/view"

const TlsConfigurationsPages = {
  Index: TlsConfigurationsIndexPage,
  View: TlsConfigurationsViewPage,
}

const PostPages = {
  Index: PostIndexPage,
  View: PostViewPage,
}

export { AuthPage, TlsConfigurationsPages, PostPages }

