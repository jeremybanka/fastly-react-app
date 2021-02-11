// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import type { ChartContextType } from "./types";

export const ChartContext = React.createContext<ChartContextType>({
  hoverValue: null, // Date of hovered position
  brushRange: { start: null, end: null }, // Timerange of a drawn brush
  brushingRange: { start: null, end: null }, // Timerange of a drawing brush
  setHoverValue: () => undefined,
  setBrushRange: () => undefined,
  setBrushingRange: () => undefined,
});

ChartContext.displayName = "ChartContext";

type Props = {
  children: React.Node,
};
function ChartProvider(props: Props) {
  const { children } = props;
  const [hoverValue, setHoverValue] = React.useState<?Date>(null);
  const [brushRange, setBrushRange] = React.useState<{
    start: ?Date,
    end: ?Date,
  }>({ start: null, end: null });
  const [brushingRange, setBrushingRange] = React.useState<{
    start: ?Date,
    end: ?Date,
  }>({ start: null, end: null });

  return (
    <ChartContext.Provider
      value={{
        hoverValue,
        brushRange,
        brushingRange,
        setHoverValue,
        setBrushRange,
        setBrushingRange,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export default ChartProvider;
