// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import type { LoadingProps } from "../types";

function Loading(props: LoadingProps): React.Node {
  const { isLoading = false, width, height, theme } = props;
  const { colors } = theme;

  return isLoading ? (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={colors.muted}
      opacity={0.2}
    />
  ) : null;
}

export default Loading;
