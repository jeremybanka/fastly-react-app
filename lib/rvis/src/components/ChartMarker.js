// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Bar } from "@visx/shape";
import { ChartContext } from "../ChartProvider";
import ChartMarkerText from "./ChartMarkerText";
import type { ChartMarkerProps } from "../types";

function ChartMarker(props: ChartMarkerProps): React.Node {
  const { xScaleChart, yMax, xMax, theme, markerWidth = 1 } = props;
  const { colors } = theme;
  const { hoverValue } = React.useContext(ChartContext);

  const markerHeight = yMax;
  const xMarker = xScaleChart(hoverValue);
  const yMarker = 0;

  if (!hoverValue || xMarker === undefined || xMarker < 0) return null;

  return (
    <>
      <Bar
        x={xMarker}
        y={yMarker}
        width={markerWidth}
        height={markerHeight}
        fill={colors.text}
        fillOpacity={0.3}
      />
      <ChartMarkerText
        label={hoverValue.toLocaleString()}
        xPos={xMarker}
        yMax={yMax}
        xMax={xMax}
        theme={theme}
        align="middle"
      />
    </>
  );
}

export default ChartMarker;
