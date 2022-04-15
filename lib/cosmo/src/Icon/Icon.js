/* @flow */

import * as React from "react";
import styled from "styled-components";
import css from "@styled-system/css";

// Full list of available icons: https://material-ui.com/components/material-icons
import {
  AccessTime,
  AddCircle,
  Announcement,
  ArrowBack,
  ArrowDownward,
  ArrowDropDown,
  ArrowDropUp,
  ArrowForward,
  ArrowUpward,
  Block,
  Cancel,
  Check,
  CheckCircle,
  Close,
  CloudDownload,
  Copy,
  DeleteForever,
  Dvr,
  Edit,
  Flag,
  Fullscreen,
  FullscreenExit,
  Group,
  Info,
  Input,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  Label,
  Link,
  Menu,
  MoreHoriz,
  MoreVert,
  MultilineChart,
  Notifications,
  Person,
  PersonAdd,
  PhonelinkLock,
  Power,
  RemoveRedEye,
  Search,
  Security,
  Settings,
  SettingsEthernet,
  SigSciMove,
  SigSciTVChart,
  Star,
  Timeline,
  Tune,
  VerifiedUser,
  ViewCarousel,
  VpnKey,
  Warning,
} from "./svgs";

const availableIcons = {
  AccessTime,
  AddCircle,
  Announcement,
  ArrowBack,
  ArrowDownward,
  ArrowDropDown,
  ArrowDropUp,
  ArrowForward,
  ArrowUpward,
  Block,
  Cancel,
  Check,
  CheckCircle,
  Close,
  Clock: AccessTime,
  CloudDownload,
  Copy,
  DeleteForever,
  Download: CloudDownload,
  Dvr,
  Edit,
  Ethernet: SettingsEthernet,
  Eye: RemoveRedEye,
  FileDownload: CloudDownload,
  Flag,
  Fullscreen,
  FullscreenExit,
  Group,
  Info,
  Input,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  Label,
  Link,
  Menu,
  ModeEdit: Edit,
  MoreHoriz,
  MoreVert,
  MultilineChart,
  Notifications,
  Person,
  PersonAdd,
  PhonelinkLock,
  Power,
  RemoveRedEye,
  Search,
  Security,
  Settings,
  SettingsEthernet,
  SigSciMove,
  SigSciTVChart,
  Star,
  Timeline,
  Tune,
  Shield: Security,
  VerifiedUser,
  ViewCarousel,
  VpnKey,
  Warning,
};

const IconWrapper = styled("span")((props) => {
  return css({
    display: "inline-flex",
    alignSelf: "center",
    position: "relative",
    height: "1em",
    width: "1em",
  });
});

const IconSvg = styled("svg")((props) => {
  return css({
    display: "inline-block",
    userSelect: "none",
    fill: "currentColor",
    height: "1em",
    width: "1em",
    // bottom: "-0.125em", // TODO: do we need this line?
    position: "absolute",
  });
});

type IconProps = {
  glyph: $Keys<typeof availableIcons>,
};

const Icon = (props: IconProps) => {
  const { glyph } = props;

  const MaterialIcon = availableIcons[glyph];

  return (
    <IconWrapper>
      <IconSvg viewBox="0 0 24 24">
        <MaterialIcon />
      </IconSvg>
    </IconWrapper>
  );
};

export default Icon;
