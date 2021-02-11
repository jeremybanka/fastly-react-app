// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Text } from "@visx/text";
import { AxisBottom } from "@visx/axis";
import { ChartContext } from "../ChartProvider";
import type { AxisBottomProps } from "../types";

function AxisX(props: AxisBottomProps): React.Node {
  const { yMax, scale, theme, width } = props;
  const { colors, fonts } = theme;
  const { hoverValue, brushingRange } = React.useContext(ChartContext);

  // hide AxisX when displaying ChartMarkerText
  if (hoverValue || brushingRange.start) return null;

  // rough calculation to give each tick label room for legibility
  const numTicks = width ? Math.floor(width / 100) : null;

  return (
    <AxisBottom
      top={yMax}
      scale={scale}
      hideAxisLine
      hideTicks
      numTicks={numTicks}
      tickComponent={(tickProps) => (
        <Text
          transform={tickProps.transform}
          fill={colors.text}
          fontFamily={fonts.mono}
          fontSize={tickProps.fontSize}
          x={tickProps.x}
          y={tickProps.y}
          textAnchor="middle"
        >
          {tickProps.formattedValue}
        </Text>
      )}
    />
  );
}

export default AxisX;
