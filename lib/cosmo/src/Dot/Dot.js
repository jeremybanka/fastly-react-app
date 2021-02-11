/* @flow */

import type { ComponentType } from "react";
import styled from "styled-components";
import { variant } from "styled-system";

type PropsType = {
  purpose: "neutral" | "info" | "success" | "warning" | "danger",
};

const Dot: ComponentType<PropsType> = styled("div")(
  {
    display: "inline-block",
    borderRadius: 8,
    width: 8,
    height: 8,
  },
  variant({
    variants: {
      neutral: { backgroundColor: "grays.2" },
      info: { backgroundColor: "indigo" },
      success: { backgroundColor: "green" },
      warning: { backgroundColor: "gold" },
      danger: { backgroundColor: "red" },
    },
  })
);

/** @component */
export default Dot;
