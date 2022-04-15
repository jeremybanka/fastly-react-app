/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Box, Flexbox, InputValue, InputValueHelper, Text } from "../";
import styled from "styled-components";
import css from "@styled-system/css";

const StyledInput = styled("input")(() => {
  return css({
    // specificity hack to override legacy opacity
    // TODO: remove specificity hack
    "&&": {
      // hides input and still allows :focus
      opacity: "0.0", // 0.0 to avoid interpretation as `theme.opacity[0]`
    },
  });
});

const StyledInputContainer = styled("label")(() => {
  return css({
    position: "relative",
    display: "inline-block",
    width: "md",
    height: "md",
    verticalAlign: "middle",
  });
});

const StyledDot = styled("div")(() => {
  return css({
    position: "absolute",
    backgroundColor: "grays.0",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    borderRadius: "10em",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "grays.3",
    "&:hover": {
      borderColor: "grays.4",
    },
    [`${StyledInput}:disabled + &`]: {
      borderColor: "grays.3",
      backgroundColor: "grays.1",
      cursor: "not-allowed", // remove or apply to corresponding label?
    },
    [`${StyledInput}:active + &, ${StyledInput}:focus + &`]: {
      borderColor: "grays.6",
      // dashed border might work, but it is a square :(
      // outlineStyle: "dashed",
      // outlineWidth: "1px",
      // outlineColor: props.theme.colors.grays[7],
    },
    "&:before": {
      boxSizing: "border-box",
      position: "absolute",
      content: '""',
      top: "3px",
      left: "3px",
      width: "sm",
      height: "sm",
      backgroundColor: "indigo",
      borderRadius: "10em",
      transform: "scale(0)",
    },
    [`${StyledInput}:checked + &:before`]: {
      transform: "scale(1)",
    },
    [`${StyledInput}:checked:disabled + &:before`]: {
      backgroundColor: "grays.3",
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
  value: string,
  checked: boolean,
  // required?: boolean, // represent in UI?
  disabled?: boolean,
  onChange: (e: any) => void,
  onFocus?: (e: any) => void,
  onBlur?: (e: any) => void,
};

type RadioInputProps = {
  input: FieldInputProps,
  label: TextType,
  helper?: TextType,
};

const RadioInput = (props: RadioInputProps) => {
  const { label, helper, input } = props;
  return (
    <Box>
      <Flexbox>
        <Box>
          <StyledInputContainer htmlFor={input.id}>
            <StyledInput type="radio" {...input} />
            <StyledDot />
          </StyledInputContainer>
        </Box>
        <Box marginLeft="sm">
          <Box>
            <InputValue htmlFor={input.id}>{label}</InputValue>
          </Box>
          {helper ? (
            <Box>
              <InputValueHelper htmlFor={input.id}>{helper}</InputValueHelper>
            </Box>
          ) : null}
        </Box>
      </Flexbox>
    </Box>
  );
};

export default RadioInput;
