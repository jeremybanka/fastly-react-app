/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const PageHeader = (props: Props) => (
  <Box paddingBottom="md" marginBottom="lg" borderBottom="regular">
    {props.children}
  </Box>
);

export default PageHeader;
