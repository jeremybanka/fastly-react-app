/* @flow */

import type { ComponentType } from "react";
import styled from "styled-components";
import css from "@styled-system/css";

type Props = {
  active: boolean,
  children: React.Node,
};

const Tab: ComponentType<Props> = styled("a")((props) =>
  css({
    display: "block",
    borderRadius: "100px",
    paddingY: "sm",
    paddingX: "md",
    textDecoration: "none",
    backgroundColor: props.active && "indigos.1",
    color: props.active ? "indigo" : "grays.4",
    fontWeight: "semibold",
    "&:hover, &:focus": {
      outline: "0",
      backgroundColor: !props.active && "grays.1",
    },
  })
);

/** @component */
export default Tab;
