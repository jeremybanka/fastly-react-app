/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const PageBody = (props: Props) => (
  <Box marginBottom="lg">{props.children}</Box>
);

export default PageBody;
