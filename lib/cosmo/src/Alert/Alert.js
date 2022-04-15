/* @flow */

import * as React from "react";
import type { ComponentType } from "react";
import styled from "styled-components";
import { variant } from "styled-system";
import css from "@styled-system/css";
import { Box, Flexbox, Dot } from "../";

// based on Link
// this can all be removed if Alert is moved to /components instead of /cosmo-ui
const StyledDismissButton: ComponentType<*> = styled("button")(
  css({
    color: "grays.7",
    padding: "xxs",
    border: "none",
    textDecoration: "underline",
    backgroundColor: "transparent",
    textAlign: "left", // for multiline buttons (e.g. on requests page)
    fontWeight: "semibold",
    width: "16px", // arbitrary height to make the icon the right size visually
    "&:hover": {
      color: "grays.4",
    },
    "&:active": { color: "grays.5" },
    // a discussion about this convoluted :focus, :focus-visible stuff
    // https://developer.paciellogroup.com/blog/2018/03/focus-visible-and-backwards-compatibility/
    "&:focus": {
      outlineStyle: "dashed",
      outlineWidth: "1px",
      outlineColor: "currentColor",
    },
    "&:focus:not(:focus-visible)": {
      outline: "none",
    },
    "&:focus-visible": {
      outlineStyle: "dashed",
      outlineWidth: "1px",
      outlineColor: "currentColor",
    },
    "&:disabled": {
      cursor: "not-allowed",
    },
  })
);

type Variant = "info" | "success" | "warning" | "danger";

type AlertBoxProps = { variant: Variant };

const AlertBox: ComponentType<AlertBoxProps> = styled("div")(
  css({
    paddingY: "md",
    paddingX: "lg",
    borderRadius: "sm",
    fontSize: "sm", // doing this here to avoid line-height issue
    "& a": { textDecoration: "underline" },
  }),
  variant({
    variants: {
      info: { backgroundColor: "indigos.1" },
      success: { backgroundColor: "greens.1" },
      warning: { backgroundColor: "golds.1" },
      danger: { backgroundColor: "reds.1" },
    },
  })
);

type Props = {
  children: React.Node,
  onDismiss?: (event: SyntheticEvent<HTMLButtonElement>) => void,
  variant: Variant,
};

const Alert = (props: Props) => {
  const { onDismiss, children, variant } = props;

  return (
    <AlertBox variant={variant}>
      <Flexbox alignItems="center">
        <Box marginRight="md">
          <Flexbox alignItems="center">
            <Dot variant={variant} />
          </Flexbox>
        </Box>
        <Flexbox flexGrow="1">{children}</Flexbox>
        {onDismiss ? (
          <Box marginLeft="sm">
            <StyledDismissButton onClick={onDismiss}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                {/* TODO: could this be done better? */}
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </StyledDismissButton>
          </Box>
        ) : null}
      </Flexbox>
    </AlertBox>
  );
};

/** @component */
export default Alert;
