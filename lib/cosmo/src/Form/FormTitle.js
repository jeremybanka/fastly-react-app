/* @flow */

import * as React from "react";
import { Box, Text } from "../";

type Props = { children: React.Node };

const FormTitle = (props: Props) => (
  <Box>
    {/* hmm */}
    <Text as="h4">{props.children}</Text>
  </Box>
);

export default FormTitle;
