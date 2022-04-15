/* @flow */

import * as React from "react";
import type { ComponentType } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { Box, Text } from "../";
import css from "@styled-system/css";

type TextType =
  | string
  | React.Element<typeof Text>
  | React.Element<typeof FormattedMessage>;

type CardProps = { children: React.Node };
const Card: ComponentType<CardProps> = styled("div")(
  css({
    display: "flex",
    flexDirection: "column",
    backgroundColor: "grays.0",
    // height: "100%", // problematic for unknown reasons
    // padding: "lg", // probably reinstate for sigsci, or control with prop
    // [`.SortableItem--dragging &,
    //   &:hover`]: { boxShadow: "lg" },
    // "& .card-header-buttons": { visibility: "hidden" },
    // [`&:hover .card-header-buttons,
    //   .SortableItem--dragging & .card-header-buttons`]: {
    //   visibility: "visible",
    // },
  })
);

type CardHeaderProps = { children: React.Node };
const CardHeader = (props: CardHeaderProps) => (
  <Box marginBottom="md">{props.children}</Box>
);

type CardTitleProps = { children: TextType };
const CardTitle = (props: CardTitleProps) => (
  <Box paddingBottom="sm" marginBottom="md" borderBottom="heavy">
    <Text fontWeight="bold">{props.children}</Text>
  </Box>
);

type CardSubtitleProps = { children: TextType };
const CardSubtitle = (props: CardSubtitleProps) => (
  <Box>
    <Text fontSize="sm" color="grays.4">
      {props.children}
    </Text>
  </Box>
);

type CardBodyProps = { children: React.Node };
const CardBody: ComponentType<CardBodyProps> = styled("div")({
  flex: "1 1 0%",
});

type CardFooterProps = { children: React.Node };
const CardFooter: ComponentType<CardFooterProps> = styled("div");

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export default Card;
