/* @flow */

import * as React from "react";
import { Box, Text } from "../";

type Props = { children: React.Node };

const FormSubtitle = (props: Props) => (
  <Box>
    <Text fontSize="sm">{props.children}</Text>
  </Box>
);

export default FormSubtitle;
