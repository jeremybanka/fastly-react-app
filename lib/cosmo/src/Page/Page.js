/* @flow */

import * as React from "react";
import { Box } from "../";
import PageBody from "./PageBody";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";
import PageTitle from "./PageTitle";
import PageSubtitle from "./PageSubtitle";

type Props = { children: React.Node };

const Page = (props: Props) => {
  return (
    <Box position="relative" marginTop="lg">
      {props.children}
    </Box>
  );
};

Page.Body = PageBody;
Page.Footer = PageFooter;
Page.Header = PageHeader;
Page.Title = PageTitle;
Page.Subtitle = PageSubtitle;

export default Page;
