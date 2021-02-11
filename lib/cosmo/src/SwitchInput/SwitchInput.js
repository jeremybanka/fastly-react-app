/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Box, Flexbox, InputValue, Text } from "../";
import styled from "styled-components";
import css from "@styled-system/css";

function hexToRGBA(hex, alpha = 1) {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha});`;
}

function addOpacityToRGB(rgba, alpha = 1) {
  return `${rgba.slice(0, -1)}, ${alpha})`;
}

const StyledInput = styled("input")(() => {
  return css({
    // specificity hack to override legacy opacity
    "&&": {
      opacity: "0", // hides input and still allows :focus
    },
  });
});

const width = 64;
const height = 24;
const sliderSize = 32;
const sliderCheckedPosition = width - sliderSize;

const StyledInputContainer = styled("label")(() => {
  return css({
    position: "relative",
    display: "inline-block",
    width,
    height,
    verticalAlign: "middle",
  });
});

const StyledSwitch = styled("div")((props) => {
  return css({
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "grays.3",
    transition: "75ms",
    borderRadius: "10em",
    [`${StyledInput}:disabled + &`]: {
      backgroundColor: hexToRGBA(props.theme.colors.grays[3], 0.4),
      cursor: "not-allowed", // remove or apply to corresponding label?
    },
    [`${StyledInput}:checked:disabled + &`]: {
      backgroundColor: addOpacityToRGB(props.theme.colors.indigo, 0.4),
    },
    [`${StyledInput}:checked + &`]: {
      backgroundColor: "indigo",
    },
    "&:before": {
      boxSizing: "border-box",
      position: "absolute",
      content: '""',
      height: `${sliderSize}px`,
      width: `${sliderSize}px`,
      left: "0",
      bottom: `${height / 2 - sliderSize / 2}px`,
      backgroundColor: "grays.3",
      transition: "75ms",
      boxShadow: "lg",
      borderRadius: "10em",
      borderColor: "#fff", // force always white
      borderStyle: "solid",
      borderWidth: `${sliderSize / 2}px`,
    },
    [`${StyledInput}:disabled + &:before`]: {
      backgroundColor: hexToRGBA(props.theme.colors.grays[3], 0.4),
    },
    [`${StyledInput}:checked:disabled + &:before`]: {
      backgroundColor: addOpacityToRGB(props.theme.colors.indigo, 0.4),
    },
    [`${StyledInput}:focus + &:before, ${StyledInput}:active + &:before`]: {
      borderWidth: "8px", // theme.borderWidths / md
    },
    [`${StyledInput}:checked + &:before`]: {
      backgroundColor: "indigo",
      transform: `translateX(${sliderCheckedPosition}px)}`,
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
  // value?: string, // omit for `[name]=on`, include for `[name]=[value]`
  checked: boolean,
  // required?: boolean, // represent in UI?
  disabled?: boolean,
  onChange: (e: any) => void,
  onFocus?: (e: any) => void,
  onBlur?: (e: any) => void,
};

type SwitchInputProps = {
  input: FieldInputProps,
  label: TextType,
};

const SwitchInput = (props: SwitchInputProps) => {
  const { label, input } = props;
  return (
    <Box>
      <Flexbox alignItems="center">
        <Box>
          <StyledInputContainer htmlFor={input.id}>
            <StyledInput type="checkbox" {...input} />
            <StyledSwitch />
          </StyledInputContainer>
        </Box>
        <Box marginLeft="sm">
          <Box>
            <InputValue htmlFor={input.id}>{label}</InputValue>
          </Box>
        </Box>
      </Flexbox>
    </Box>
  );
};

export default SwitchInput;
