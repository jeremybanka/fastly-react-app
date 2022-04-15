/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Text } from "../";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type InputLabelProps = {
  htmlFor: string,
  children: TextType,
};
const InputLabel = (props: InputLabelProps) => {
  return (
    <Text
      as="label"
      htmlFor={props.htmlFor}
      letterSpacing="xs"
      color="grays.6"
      fontSize="xs"
    >
      {props.children}
    </Text>
  );
};

export default InputLabel;
