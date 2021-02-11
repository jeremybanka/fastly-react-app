// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { PatternLines } from "@visx/pattern";
import { ChartContext } from "../ChartProvider";
import ChartMarkerText from "./ChartMarkerText";
import type { BrushMaskProps } from "../types";

function BrushMask(props: BrushMaskProps): React.Node {
  const { xScaleTime, xMax, yMax, theme } = props;
  const { colors } = theme;
  const { hoverValue, brushingRange } = React.useContext(ChartContext);

  if (!brushingRange.start || !brushingRange.end) return null;

  const xStart: number =
    xScaleTime(brushingRange.start) > 0 ? xScaleTime(brushingRange.start) : 0;
  const xEnd: number =
    xScaleTime(brushingRange.end) < xMax ? xScaleTime(brushingRange.end) : xMax;
  const strokeWidth = 1;

  if (!xStart || !xEnd) return null;

  return (
    <>
      <PatternLines
        id="lines"
        height={4}
        width={4}
        stroke={colors.muted}
        strokeWidth={1}
        orientation={["diagonal"]}
      />
      <rect
        x={0}
        y={0}
        width={xStart}
        height={yMax}
        fill="url('#lines')"
        opacity="0.7"
      />
      <line
        x1={xStart - strokeWidth}
        y1={0}
        x2={xStart - strokeWidth}
        y2={yMax}
        stroke={colors.text}
        strokeWidth={strokeWidth}
      />
      <rect
        x={xEnd >= xMax ? xMax : xEnd}
        y={0}
        width={xEnd >= xMax ? 0 : xMax - xEnd}
        height={yMax}
        fill="url('#lines')"
        opacity="0.7"
      />
      <line
        x1={xEnd + strokeWidth}
        y1={0}
        x2={xEnd + strokeWidth}
        y2={yMax}
        stroke={colors.text}
        strokeWidth={strokeWidth}
      />
      {hoverValue ? null : (
        <>
          <ChartMarkerText
            label={
              brushingRange.start ? brushingRange.start.toLocaleString() : ""
            }
            xPos={xStart}
            xMax={xMax}
            yMax={yMax}
            theme={theme}
            align="end"
          />
          <ChartMarkerText
            label={brushingRange.end ? brushingRange.end.toLocaleString() : ""}
            xPos={xEnd}
            xMax={xMax}
            yMax={yMax}
            theme={theme}
            align="start"
          />
        </>
      )}
    </>
  );
}

export default BrushMask;
