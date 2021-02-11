// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Text } from "@visx/text";
import { AxisLeft } from "@visx/axis";
import type { AxisLeftProps } from "../types";

function AxisY(props: AxisLeftProps): React.Node {
  const {
    scale,
    yMax,
    yScale,
    theme,
    margin,
    formatTickLabel,
    onClick,
  } = props;
  const { colors, fonts } = theme;

  const domain = scale.domain();

  return (
    <>
      <AxisLeft
        scale={scale}
        hideTicks
        hideAxisLine
        // tickLength is set to 0 so that ticks don't take up any space
        // and tickComponent's dx value works as intended.
        // The default tickLength value is 8.
        tickLength={0}
        // set ticks to start, middle, end values
        tickValues={[...domain, domain[1] / 2]}
        tickComponent={(tickProps) => {
          const { formattedValue, transform, fontSize, x, y } = tickProps;
          const value = formatTickLabel(formattedValue);

          return (
            <Text
              transform={transform}
              fill={colors.text}
              fontFamily={fonts.mono}
              fontSize={fontSize}
              x={x}
              y={y}
              textAnchor="start" // left align text
              verticalAnchor="middle" // vertically-align text
              dx={-margin.left} // move it to the left edge
            >
              {value}
            </Text>
          );
        }}
      />
      <rect
        x={-margin.left}
        y={0}
        width={margin.left}
        height={yMax}
        opacity={0}
        onClick={() => onClick(yScale)}
      />
    </>
  );
}

export default AxisY;
