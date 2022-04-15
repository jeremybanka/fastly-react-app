/* @flow */

import type { ComponentType } from "react";
import styled from "styled-components";
import { space, typography, color, variant } from "styled-system";

// TODO
type PropsType = any;
const Text: ComponentType<PropsType> = styled("span")(
  typography,
  color,
  space,
  variant({
    prop: "purpose",
    variants: {
      success: { color: "green" },
      warning: { color: "gold" },
      danger: { color: "red" },
      muted: { color: "grays.3" },
    },
  })
);

/** @component */
export default Text;
