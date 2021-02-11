// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Text } from "@visx/text";
import type { ChartMarkerTextProps } from "../types";

const calculateTextX = (xPos, textWidth, xMax, align): number => {
  const lowestX = align === "middle" ? textWidth / 2 : textWidth;
  const highestX = align === "middle" ? xMax - textWidth / 2 : xMax - textWidth;
  return Math.min(Math.max(lowestX, xPos), highestX);
};

function ChartMarkerText(props: ChartMarkerTextProps): React.Node {
  const { label, xPos, xMax, yMax, theme, align = "middle" } = props;
  const { colors, fonts } = theme;
  const [textWidth, setTextWidth] = React.useState(0);

  return (
    <Text
      fill={colors.text}
      fontFamily={fonts.mono}
      fontSize={10} // tickProps.fontSize
      x={calculateTextX(xPos, textWidth, xMax, align)}
      y={yMax + 18} // align with ticks
      textAnchor={align}
      innerRef={(x) => {
        if (!x) return null;
        // approximate the width since the dynamic text will change this
        // value slightly for each data point
        const bBoxWidth = Math.floor(x.getBBox().width);
        if (bBoxWidth !== textWidth) setTextWidth(bBoxWidth);
        return null;
      }}
    >
      {label}
    </Text>
  );
}

export default ChartMarkerText;
