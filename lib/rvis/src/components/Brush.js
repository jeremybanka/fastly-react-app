// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { Brush as VXBrush } from "@visx/brush";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { ChartContext } from "../ChartProvider";
import type { BrushProps } from "../types";

function Brush(props: BrushProps): React.Node {
  const {
    data,
    xScaleTime,
    yScale,
    xMax,
    yMax,
    margin,
    onClearBrush,
    getDate,
  } = props;

  const {
    hoverValue,
    brushRange,
    setHoverValue,
    setBrushRange,
    setBrushingRange,
  } = React.useContext(ChartContext);

  // return closest datum date for a given date
  const closestDatumDate = (xDate: Date): Date => {
    const { center } = bisector(getDate);
    const index = center(data, xDate);
    return getDate(data[index]);
  };

  // return closest datum date for a given x position
  const datumDateFromXPos = (xPos: number): Date => {
    const xDate = xScaleTime.invert(xPos);
    return closestDatumDate(xDate);
  };

  return (
    <VXBrush
      key={
        brushRange.start && brushRange.end
          ? `${(brushRange.start || "").valueOf()}-${(
              brushRange.end || ""
            ).valueOf()}`
          : null
      }
      xScale={xScaleTime}
      yScale={yScale}
      width={xMax}
      height={yMax}
      margin={margin}
      handleSize={20}
      selectedBoxStyle={{ fillOpacity: 0 }}
      onBrushEnd={(bounds) =>
        bounds
          ? setBrushRange({
              start: closestDatumDate(bounds.x0),
              end: closestDatumDate(bounds.x1),
            })
          : null
      }
      onBrushStart={() => setHoverValue(null)}
      onChange={(bounds) =>
        bounds
          ? setBrushingRange({
              start: closestDatumDate(bounds.x0),
              end: closestDatumDate(bounds.x1),
            })
          : null
      }
      initialBrushPosition={
        brushRange.start && brushRange.end
          ? {
              start: { x: xScaleTime(brushRange.start) },
              end: { x: xScaleTime(brushRange.end) },
            }
          : null
      }
      onMouseMove={(event) => {
        // get mouseposition
        const { x } = localPoint(event) || { x: 0 };
        const xPos = x - margin.left;
        // get date at mouseposition
        const datumDate = datumDateFromXPos(xPos);

        // Do not set hover when mouse is outside the brush range
        if (brushRange.start && brushRange.end) {
          const brushingStartX = xScaleTime(brushRange.start);
          const brushingEndX = xScaleTime(brushRange.end);
          if (xPos < brushingStartX || xPos > brushingEndX) return null;
        }

        // Set hover value (if different from current)
        return datumDate !== hoverValue ? setHoverValue(datumDate) : null;
      }}
      onMouseLeave={() => setHoverValue(null)}
      onClick={onClearBrush}
    />
  );
}

export default Brush;
