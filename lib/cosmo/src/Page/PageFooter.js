/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const PageFooter = (props: Props) => (
  <Box paddingTop="md" marginTop="lg">
    {props.children}
  </Box>
);

export default PageFooter;
