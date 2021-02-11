// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import Brush from "./Brush";
import BrushActions from "./BrushActions";
import BrushMask from "./BrushMask";
import ChartMarker from "./ChartMarker";
import { ChartContext } from "../ChartProvider";
import type { ChartInteractionsProps } from "../types";

function ChartInteractions(props: ChartInteractionsProps): React.Node {
  const {
    data,
    xScaleTime,
    xScaleChart,
    yScale,
    xMax,
    yMax,
    pointWidth,
    margin,
    theme,
    getDate,
    onApplyBrush,
  } = props;

  const { setBrushRange, setBrushingRange } = React.useContext(ChartContext);

  const handleClearBrush = () => {
    setBrushRange({
      start: null,
      end: null,
    });
    setBrushingRange({
      start: null,
      end: null,
    });
  };

  return (
    <>
      <ChartMarker
        xScaleChart={xScaleChart}
        yMax={yMax}
        xMax={xMax}
        theme={theme}
        markerWidth={pointWidth}
      />
      <BrushMask
        xScaleTime={xScaleTime}
        xMax={xMax}
        yMax={yMax}
        theme={theme}
      />
      <Brush
        data={data}
        xScaleTime={xScaleTime}
        yScale={yScale}
        xMax={xMax}
        yMax={yMax}
        margin={margin}
        getDate={getDate}
        onClearBrush={handleClearBrush}
      />
      <BrushActions
        xMax={xMax}
        theme={theme}
        onApplyBrush={onApplyBrush}
        onClearBrush={handleClearBrush}
      />
    </>
  );
}

export default ChartInteractions;
