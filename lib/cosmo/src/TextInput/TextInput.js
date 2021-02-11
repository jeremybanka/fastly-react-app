/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Box, Flexbox, InputError, InputHelper, InputLabel, Text } from "../";
import styled from "styled-components";
import css from "@styled-system/css";

const StyledInput = styled("input")((props) => {
  return css({
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "grays.0",

    paddingLeft: "md",
    paddingRight: "md",
    width: "100%",
    height: "xl",
    color: "grays.6",
    fontWeight: "semibold",
    fontSize: "xs",
    letterSpacing: "xs",
    borderRadius: "0",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: props.errored ? "reds.5" : "grays.2",
    "&[errored]": {
      borderColor: "reds.5",
    },
    "&:enabled:hover": {
      borderColor: "grays.3",
    },
    "&:enabled:active, &:enabled:focus": {
      borderColor: "grays.6",
    },
    "&:disabled": {
      cursor: "not-allowed", // remove or apply to corresponding label?
    },
    "&:disabled, &[readOnly]": {
      color: "grays.4",
      backgroundColor: "grays.1",
      // unset legacy overrides from Button.css
      opacity: "1",
      pointerEvents: "auto",
    },
    "&::placeholder": {
      color: "grays.4",
      fontWeight: "normal",
    },
  });
});

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type FieldInputProps = {
  name: string,
  id: string,
  value?: string,
  defaultValue?: string,
  placeholder: string,
  minLength?: number,
  maxLength?: number,
  required?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
  type?: "text" | "number",
  onChange?: (e: any) => void,
  onFocus?: (e: any) => void,
  onBlur?: (e: any) => void,
};

type TextInputProps = {
  input: FieldInputProps,
  label?: TextType,
  helper?: TextType,
  error?: ?TextType,
};

const TextInput = (props: TextInputProps) => {
  const { label, helper, error, input } = props;
  const { type = "text" } = input;
  return (
    <Box width="100%">
      {/* if no label is provided, hide all metadata above the input */}
      {label ? (
        <Box marginBottom="xs">
          <Flexbox justifyContent="space-between" alignItems="baseline">
            <Box>
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
            <Box>
              {input.maxLength ? (
                <Text
                  color="grays.4"
                  fontSize="xxs"
                  as="label"
                  htmlFor={input.id}
                >
                  {input.value.length}/{input.maxLength}
                </Text>
              ) : null}
            </Box>
          </Flexbox>
        </Box>
      ) : null}
      <StyledInput {...input} type={type} errored={!!error} />
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

export default TextInput;
