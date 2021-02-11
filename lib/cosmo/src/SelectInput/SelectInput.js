/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Box, Icon, InputError, InputHelper, InputLabel, Text } from "../";
import styled from "styled-components";
import css from "@styled-system/css";

const StyledInputContainer = styled("div")((props) => {
  let borderColor = "grays.2";
  if (props.errored) borderColor = "reds.5";
  if (props.focused) borderColor = "grays.6";
  return css({
    position: "relative",
    height: "xl",
    borderRadius: "0",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor,
    "&:hover": {
      // scope to :enabled?
      // :focus should override :hover
      borderColor: "grays.3",
    },
    "&:focus": {
      borderColor: "grays.6",
    },
    backgroundColor: "grays.0",
  });
});

const StyledInput = styled("select")(() => {
  return css({
    outline: "none",
    display: "block",
    width: "100%",
    height: "100%",
    paddingLeft: "md",
    // | ------------------- |
    // | select text [arrow] |
    // | ------------------- |
    //              ▲   ▲   ▲
    //              A   B   C
    // internal padding (A) + icon width (B) + edge padding (C)
    //                          A          B             C
    //                          ▼          ▼             ▼
    // paddingRight: "calc(var(--space-sm) + 10px + var(--space-md))",
    color: "grays.6",
    background: "transparent",
    lineHeight: "normal",
    overflow: "hidden",
    cursor: "pointer",
    borderRadius: "0",
    "webkit-appearance": "none",
    "-moz-appearance": "none",
    "-ms-appearance": "none",
    "-o-appearance": "none",
    appearance: "none", // automatically prefixed?
    textIndent: "0.01px", // fixes a firefox bug i think
    textTransform: "none", // and on button ?
    border: "0",
    fontSize: "xs",
    fontWeight: "semibold",
    "&:disabled": {
      cursor: "not-allowed", // remove or apply to corresponding label?
      color: "grays.4",
      backgroundColor: "grays.1",
      // unset legacy overrides from Button.css
      opacity: "1",
      pointerEvents: "auto",
    },
  });
});

const StyledArrow = styled("span")(() => {
  return css({
    position: "absolute",
    top: "0",
    right: "7px" /* ArrowDropDown icon doesn't take up its full SVG viewbox */,
    bottom: "0",
    width: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "grays.4",
    pointerEvents: "none",
  });
});

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type Option = {
  value: string, // TextType?
  label: string,
  disabled?: boolean,
};

type FieldInputProps = {
  name: string,
  id: string,
  value: string,
  required?: boolean,
  disabled?: boolean,
  onChange: (e: any) => void,
  onFocus?: (e: any) => void,
  onBlur?: (e: any) => void,
};

type SelectInputProps = {
  input: FieldInputProps,
  label?: TextType,
  helper?: TextType,
  error?: ?TextType,
  options: Option[],
};

const SelectInput = (props: SelectInputProps) => {
  const { label, helper, error, input, options } = props;
  const { onFocus, onBlur, ...inputRest } = input;
  const [focus, setFocus] = React.useState(false);
  return (
    <Box>
      {/* if no label is provided, hide all metadata above the input */}
      {label ? (
        <Box marginBottom="xs">
          {/* $FlowFixMe - InputLabel expects text, not array */}
          <InputLabel htmlFor={input.id}>
            {label}
            {input.required ? null : (
              <Text color="grays.4" marginLeft="xs">
                (optional)
              </Text>
            )}
          </InputLabel>
        </Box>
      ) : null}
      <StyledInputContainer errored={!!error} focused={focus}>
        <StyledInput
          onFocus={(event) => {
            setFocus(true);
            if (input.onFocus) input.onFocus(event);
          }}
          onBlur={(event) => {
            setFocus(false);
            if (input.onBlur) input.onBlur(event);
          }}
          {...inputRest} // smelly
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </StyledInput>
        <StyledArrow>
          <Icon glyph="KeyboardArrowDown" />
        </StyledArrow>
      </StyledInputContainer>
      {helper ? (
        <Box marginTop="xs" fontSize="xxs">
          <InputHelper htmlFor={input.id}>{helper}</InputHelper>
        </Box>
      ) : null}
      {error ? (
        <Box marginTop="xs" fontSize="xxs">
          <InputError htmlFor={input.id}>{error}</InputError>
        </Box>
      ) : null}
    </Box>
  );
};

export default SelectInput;
