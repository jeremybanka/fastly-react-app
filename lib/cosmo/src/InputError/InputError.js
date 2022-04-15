/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Text } from "../";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type InputErrorProps = {
  htmlFor: string,
  children: TextType,
};
const InputError = (props: InputErrorProps) => {
  return (
    <Text as="label" htmlFor={props.htmlFor} color="reds.5" fontSize="xxs">
      {props.children}
    </Text>
  );
};

export default InputError;
