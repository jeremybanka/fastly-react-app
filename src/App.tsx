import * as React from "react"

import { AuthPage, TlsConfigurationsPages } from "./pages"
// @ts-ignore
import { Box, ThemeProvider, theme as cosmoTheme, getTheme } from "cosmo"
import { GlobalStyle, Navigation } from "./components"
import { QueryClient, QueryClientProvider } from "react-query"
import { Redirect, Route, Switch, useLocation } from "react-router-dom"

import EnsureAuth from "./components/EnsureAuth"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import useLocalStorage from "./hooks/useLocalStorage"

function App() {
  const location = useLocation()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
  })

  // get browser-defined preference for dark mode
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches

  // store theme preference in local storage
  const [theme, setTheme] = useLocalStorage(
    "theme",
    prefersDarkMode ? "dark" : "light"
  )

  // e.g. 'light' → 'fastlyLight'
  const brandedTheme = location.pathname.includes("fastly")
    ? `fastly${theme.replace(theme[0], theme[0].toUpperCase())}`
    : theme

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <RecoilRoot>
        <ThemeProvider theme={getTheme(cosmoTheme, brandedTheme)}>
          <GlobalStyle />
          <Navigation theme={theme} onThemeChange={setTheme} />
          <Box padding="lg">
            <Switch>
              <Redirect exact from="/" to="/tls-configuration" />
              <Route path="/tls-configurations/:id">
                <EnsureAuth
                  render={(session) => (
                    <TlsConfigurationsPages.View session={session} />
                  )}
                />
              </Route>
              <Route path="/tls-configurations">
                <EnsureAuth
                  render={(session) => (
                    <TlsConfigurationsPages.Index session={session} />
                  )}
                />
              </Route>
              <Route path="/auth">
                <AuthPage />
              </Route>
            </Switch>
          </Box>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
