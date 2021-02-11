/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Text } from "../";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type InputValueProps = {
  htmlFor: string,
  children: TextType,
};
const InputValue = (props: InputValueProps) => {
  return (
    <Text
      as="label"
      htmlFor={props.htmlFor}
      letterSpacing="sm"
      color="grays.6"
      fontSize="xs"
      fontWeight="semibold"
    >
      {props.children}
    </Text>
  );
};

export default InputValue;
