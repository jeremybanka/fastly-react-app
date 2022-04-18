import AuthPage from "./Auth"
import AuthorIndexPage from "./AuthorPages/index"
import AuthorViewPage from "./AuthorPages/view"
import BookViewPage from "./BookPages/view"
import PostIndexPage from "./PostPages/index"
import PostViewPage from "./PostPages/view"
import TlsConfigurationsIndexPage from "./TlsConfigurationsPages/index"
import TlsConfigurationsViewPage from "./TlsConfigurationsPages/view"

const TlsConfigurationsPages = {
  Index: TlsConfigurationsIndexPage,
  View: TlsConfigurationsViewPage,
}

const PostPages = {
  Index: PostIndexPage,
  View: PostViewPage,
}

const AuthorPages = {
  Index: AuthorIndexPage,
  View: AuthorViewPage,
}

const BookPages = {
  View: BookViewPage,
}

export { AuthPage, AuthorPages, BookPages, TlsConfigurationsPages, PostPages }
