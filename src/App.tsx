import { AuthPage, PostPages, TlsConfigurationsPages } from "./pages"
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Box, ThemeProvider, theme as cosmoTheme, getTheme } from "cosmo"
import { GlobalStyle, Navigation } from "./components"
import { QueryClient, QueryClientProvider } from "react-query"
import { Redirect, Route, Switch, useLocation } from "react-router-dom"
import AuthProvider from "./components/AuthProvider"

import React from "react"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import useLocalStorage from "./hooks/useLocalStorage"

const queryClient = new QueryClient()

export default function App(): React.ReactNode {
  const location = useLocation()

  // get browser-defined preference for dark mode
  const prefersDarkMode = window?.matchMedia(`(prefers-color-scheme: dark)`).matches

  // store theme preference in local storage
  const [theme, setTheme] = useLocalStorage(`theme`, prefersDarkMode ? `dark` : `light`)

  // e.g. 'light' → 'fastlyLight'
  // const brandedTheme = 'light'
  const brandedTheme = location.pathname.includes(`fastly`)
    ? `fastly${theme.replace(theme[0], theme[0].toUpperCase())}`
    : theme

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={getTheme(cosmoTheme, brandedTheme)}>
          <AuthProvider>
            <GlobalStyle />
            <Navigation theme={theme} onThemeChange={setTheme} />
            <Box padding="lg">
              <Switch>
                <Redirect exact from="/" to="/posts" />
                <Route path="/tls-configurations/:id">
                  <TlsConfigurationsPages.View />
                </Route>
                <Route path="/tls-configurations">
                  <TlsConfigurationsPages.Index />
                </Route>
                <Route path="/posts/:id">
                  <PostPages.View />
                </Route>
                <Route path="/posts">
                  <PostPages.Index />
                </Route>
                <Route path="/auth/sign-in">
                  <AuthPage />
                </Route>
              </Switch>
            </Box>
            <ReactQueryDevtools initialIsOpen />
          </AuthProvider>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}
