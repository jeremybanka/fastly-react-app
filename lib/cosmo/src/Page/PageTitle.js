/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const PageTitle = (props: Props) => (
  <Box as="h1" margin="xxs" fontSize="xxl" fontWeight="bold">
    {props.children}
  </Box>
);

export default PageTitle;
