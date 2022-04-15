/* @flow */

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Text } from "../";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type InputHelperProps = {
  htmlFor: string,
  children: TextType,
};
const InputHelper = (props: InputHelperProps) => {
  return (
    <Text as="label" htmlFor={props.htmlFor} color="grays.4" fontSize="xxs">
      {props.children}
    </Text>
  );
};

export default InputHelper;
