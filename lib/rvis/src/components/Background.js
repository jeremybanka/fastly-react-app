// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import type { BackgroundProps } from "../types";

function Background(props: BackgroundProps): React.Node {
  const { width, height, theme } = props;
  const { colors } = theme;

  return (
    <rect x={0} y={0} width={width} height={height} fill={colors.background} />
  );
}

export default Background;
