/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Text } from "../";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type InputValueHelperProps = {
  htmlFor: string,
  children: TextType,
};
const InputValueHelper = (props: InputValueHelperProps) => {
  return (
    <Text
      as="label"
      htmlFor={props.htmlFor}
      letterSpacing="sm"
      color="grays.4"
      fontSize="xs"
    >
      {props.children}
    </Text>
  );
};

export default InputValueHelper;
