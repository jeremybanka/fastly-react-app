/* @flow */

import * as React from "react";
import { Box } from "../";

type Props = { children: React.Node };

const FormBody = (props: Props) => <Box>{props.children}</Box>;

export default FormBody;
