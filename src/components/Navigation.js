// @flow

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import css from "@styled-system/css";
import {
  theme as cosmoTheme,
  getTheme,
  Box,
  ThemeProvider,
  styled,
} from "cosmo";
import { ThemePicker } from "./";
import { parse, stringify } from "query-string";

// The nav bar should ways be dark. We force the "dark" theme so that other
// elements behave as expected on a dark background, but the tradeoff is that
// NavBar color styles are somewhat counterintuitive (e.g. backgroundColor is
// grays.2 instead of grays.6)
const NavBar = styled("div")(() => {
  return css({
    display: "flexbox",
    // backgroundColor: "grays.6", // reversed
    backgroundColor: "grays.2",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "sm",
    paddingRight: "lg", // compensates for NavBar paddingLeft + NavItem padding
  });
});

const NavItems = styled("div")(() => {
  return css({
    display: "flexbox",
    // backgroundColor: "grays.6", // reversed
    backgroundColor: "grays.2",
  });
});

const NavItem = styled(NavLink)((props) => {
  return css({
    display: "block",
    // color: props.active ? "grays.3" : "grays.1", // reversed
    color: "grays.7",
    padding: "md",
    textDecoration: "none",
    "&.isActive": {
      color: "grays.5",
    },
    ":hover": {
      // color: "grays.3", // reversed
      color: "grays.5",
    },
  });
});

type Props = {
  theme: string,
  onThemeChange: (themeName: string) => void,
};

function Navigation(props: Props): React.Node {
  const search = useLocation().search;
  const { from, until } = parse(search);
  const { theme, onThemeChange } = props;

  return (
    <ThemeProvider theme={getTheme(cosmoTheme, "dark")}>
      <NavBar>
        <NavItems>
          {[
            { path: "/fastly", label: "Fastly" },
            { path: "/origins", label: "Origin Inspector" },
            { path: "/domains", label: "Domain Inspector" },
            { path: "/realtime", label: "Real-Time" },
            { path: "/sigsci", label: "Signal Sciences" },
            { path: "/auth", label: "Auth" },
          ].map((x) => (
            <NavItem
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
  );
}

export default Navigation;
