/* @flow */

import type { ComponentType } from "react";
import styled from "styled-components";
import css from "@styled-system/css";
import { themeGet } from "@styled-system/theme-get";
import { flexbox, layout, space } from "styled-system";

type FlexboxProps = {
  children: React.Node,
  fontSize?: string,
  gap?: string,
};
const Flexbox: ComponentType<FlexboxProps> = styled("div")`
  display: flex;
  ${(props) => (props.fontSize ? css({ fontSize: props.fontSize }) : "")}
  // manually manage gap prop until styled-system supports it
  ${(props) =>
    props.gap ? css({ gap: themeGet(`space.${props.gap}`, "")(props) }) : ""}
  ${flexbox}
  ${layout}
  ${space}
`;

export default Flexbox;
