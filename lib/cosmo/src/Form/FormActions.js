/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = {
  children: React.Node,
};

const FormActions = (props: Props) => (
  <Box borderTop="light" paddingTop="md" marginTop="md">
    {props.children}
  </Box>
);

export default FormActions;
