// @flow

import * as React from "react"
import { Switch, Route, Redirect, useLocation } from "react-router-dom"
import { theme as cosmoTheme, getTheme, Box, ThemeProvider } from "cosmo"
import useLocalStorage from "./hooks/useLocalStorage"
import useAuth from "./hooks/useAuth"
import { AuthPage, FastlyPage } from "./pages"
import { GlobalStyle, Navigation } from "./components"
import mirage from "./mirage/index"

mirage({})

function App(): React.Node {
  const location = useLocation()
  const auth = useAuth()
  console.log(auth)

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
    <ThemeProvider theme={getTheme(cosmoTheme, brandedTheme)}>
      <GlobalStyle />
      <Navigation theme={theme} onThemeChange={setTheme} />
      <Box padding="lg">
        <p>LOADING: {auth.loading}</p>
        <Switch>
          <Redirect exact from="/" to="/fastly" />
          <Route path={"/fastly/:serviceId?"}>
            <FastlyPage />
          </Route>
          <Route path="/auth">
            <AuthPage />
          </Route>
        </Switch>
      </Box>
    </ThemeProvider>
  )
}

export default App
