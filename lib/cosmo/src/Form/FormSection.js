/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const FormSection = (props: Props) => <Box marginY="md">{props.children}</Box>;

export default FormSection;
