/* @flow */

import * as React from "react";
import type { LocationShape } from "react-router-dom";
import styled from "styled-components";
import { space } from "styled-system";
import css from "@styled-system/css";
import { Link } from "react-router-dom";

/** @component */
const BaseButton = styled<>("button")(
  (props) =>
    css({
      textAlign: "center",
      cursor: "default",
      height: props.size === "md" ? "40px" : "32px",
      fontWeight: "semibold",
      fontSize: "xs",
      whiteSpace: "nowrap",
      // as='button'
      border: "1px solid transparent",
      margin: "0",
      padding: "0",
      paddingX: props.size === "md" ? "12px" : "sm",
      fontFamily: "inherit",
      // as='a'
      display: "inline-block",
      lineHeight: props.size === "md" ? "40px" : "32px",
      textDecoration: "none",
      overflow: "visible", // IE
      textTransform: "none", // Firefox
      flex: props.flex,
      // as='button'
      // ---
      // re: "&:focus", "&:focus:not(:focus-visible)", and "&:focus-visible"
      // - the values for "&:focus" and "&:focus-visible" should be the same.
      // - these properties work together to provide an outline appearnce when
      //   navigating by keyboard, but not when using a mouse. this prevents an
      //   outline flash when clicking on buttons, but still renders the
      //   accessible appearance for non-mouse devices.
      "&:focus": {
        outlineStyle: "dashed",
        outlineWidth: "1px",
        outlineColor: props.theme.colors.grays[6],
      },
      "&:focus:not(:focus-visible)": {
        outline: "none",
      },
      "&:focus-visible": {
        outlineStyle: "dashed",
        outlineWidth: "1px",
        outlineColor: props.theme.colors.grays[6],
      },
      "& .Icon:first-child": { marginRight: "sm" },
      "& .Icon:last-child": { marginLeft: "sm" },
      "& .Icon:first-child:last-child": { margin: 0 },
    }),
  space // not to be abused!
);

/** @component */
const PrimaryButton = styled(BaseButton)(
  css({
    color: "#fff", // force light theme
    // TODO: remove this legacy override
    ".legacy &": {
      color: "#fff",
    },
    backgroundColor: "indigo",
    "&:hover": {
      backgroundColor: "indigos.4",
    },
    "&:active": {
      backgroundColor: "indigos.3",
    },
    "&:disabled": {
      backgroundColor: "indigos.2",
    },
  })
);
/** @component */
const SecondaryButton = styled(BaseButton)((props) =>
  css({
    color: "grays.6",
    background: "transparent",
    border: "light",
    "&:hover": {
      color: "indigo",
      backgroundColor: "indigos.0",
    },
    "&:active": {
      color: "indigo",
      background: "transparent",
    },
    "&:disabled": {
      opacity: props.theme.opacity[2],
      color: "grays.6",
      background: "transparent",
    },
  })
);
/** @component */
const DangerButton = styled(BaseButton)((props) =>
  css({
    color: "red",
    background: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "red",
    "&:hover": {
      color: "red",
      backgroundColor: "reds.0",
    },
    "&:active": {
      color: "red",
      background: "transparent",
      opacity: props.theme.opacity[2],
    },
    "&:disabled": {
      color: "red",
      borderColor: "reds.2",
      background: "transparent",
      opacity: props.theme.opacity[4],
    },
  })
);

type Shared = {|
  size: "md" | "sm",
  children: React.Node,
  variant: "primary" | "secondary" | "danger",
  disabled: boolean,
  onClick?: (SyntheticEvent<*>) => void,
  flex?: number,
|};

type Button = {|
  ...Shared,
  type?: "button" | "submit" | "reset",
|};

type Internal = {|
  ...Shared,
  to: string | LocationShape,
|};
type External = {|
  ...Shared,
  href: string,
  newTab?: boolean,
|};
type ButtonProps = Button | Internal | External;

const StyledButton = (props: ButtonProps) => {
  const { children, disabled, onClick, variant, size, flex } = props;

  let ButtonComponent = null;
  if (variant === "primary") {
    ButtonComponent = PrimaryButton;
  } else if (variant === "secondary") {
    ButtonComponent = SecondaryButton;
  } else if (variant === "danger") {
    ButtonComponent = DangerButton;
  }

  let as = null;
  let to = null;
  let href = null;
  let target = null;
  let rel = null;
  let type = null;
  if (props.to != null) {
    as = Link;
    to = props.to;
  } else if (props.href != null) {
    as = "a";
    href = props.href;
    if (props.newTab === true) {
      target = "_blank";
      rel = "noopener noreferrer";
    }
  } else {
    as = "button";
    type = props.type || "button";
  }
  return ButtonComponent ? (
    <ButtonComponent
      flex={flex}
      as={as}
      href={href}
      to={to}
      disabled={disabled}
      onClick={onClick}
      size={size}
      target={target}
      rel={rel}
      type={type}
    >
      {children}
    </ButtonComponent>
  ) : null;
};

StyledButton.defaultProps = {
  variant: "primary",
  size: "md",
  disabled: false,
};

export default StyledButton;
