/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const PageSubtitle = (props: Props) => (
  <Box color="grays.5" fontSize="sm" marginTop="sm">
    {props.children}
  </Box>
);

export default PageSubtitle;
