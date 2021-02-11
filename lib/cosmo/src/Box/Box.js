/* @flow */

import type { ComponentType } from "react";
import styled from "styled-components";
import { space, layout, color, borders, typography } from "styled-system";

// TODO
type PropsType = any;
const Box: ComponentType<PropsType> = styled("div")`
  ${typography}
  ${space}
  ${layout}
  ${color}
  ${borders}
`;

/** @component */
export default Box;
