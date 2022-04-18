import * as React from "react"

import { Box, ThemeProvider, theme as cosmoTheme, getTheme, styled } from "cosmo"
import { NavLink, useLocation } from "react-router-dom"
import { parse, stringify } from "query-string"

import { ThemePicker } from "./"
import styledCss from "@styled-system/css"

// The nav bar should ways be dark. We force the "dark" theme so that other
// elements behave as expected on a dark background, but the tradeoff is that
// NavBar color styles are somewhat counterintuitive (e.g. backgroundColor is
// grays.2 instead of grays.6)
const NavBar = styled(`div`)(() => {
  return styledCss({
    display: `flexbox`,
    // backgroundColor: "grays.6", // reversed
    backgroundColor: `grays.2`,
    justifyContent: `space-between`,
    alignItems: `center`,
    paddingLeft: `sm`,
    paddingRight: `lg`, // compensates for NavBar paddingLeft + NavItem padding
  })
})

const NavItems = styled(`div`)(() => {
  return styledCss({
    display: `flexbox`,
    // backgroundColor: "grays.6", // reversed
    backgroundColor: `grays.2`,
  })
})

const NavItem = styled(NavLink)(() => {
  return styledCss({
    display: `block`,
    // color: props.active ? "grays.3" : "grays.1", // reversed
    color: `grays.7`,
    padding: `md`,
    textDecoration: `none`,
    "&.isActive": {
      color: `grays.5`,
    },
    ":hover": {
      // color: "grays.3", // reversed
      color: `grays.5`,
    },
  })
})

function Navigation(props) {
  const { search } = useLocation()
  const { from, until } = parse(search)
  const { theme, onThemeChange } = props

  return (
    <ThemeProvider theme={getTheme(cosmoTheme, `dark`)}>
      <NavBar>
        <NavItems>
          {[
            { path: `/authors`, label: `Authors (SUMMIT)` },
            { path: `/tls-configurations`, label: `TLS` },
            { path: `/auth`, label: `Auth` },
            { path: `/posts`, label: `Posts` },
          ].map((x) => (
            <NavItem
              id={x.path}
              key={x.path}
              to={{
                pathname: x.path,
                search: stringify({ from, until }),
              }}
              activeClassName="isActive"
            >
              {x.label}
            </NavItem>
          ))}
        </NavItems>
        <Box marginX="auto" />
        <ThemePicker theme={theme} onChange={onThemeChange} />
      </NavBar>
    </ThemeProvider>
  )
}

export default Navigation
