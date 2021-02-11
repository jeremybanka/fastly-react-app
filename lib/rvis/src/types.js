// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";

/*
 * Theme
 */

export type Theme = {
  fonts: {
    sans: string,
    mono: string,
  },
  space: {
    small: number,
    large: number,
  },
  colors: {
    text: string,
    background: string,
    muted: string,
    charts: string[],
  },
};
type Margin = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

/*
 * Background
 */

export type BackgroundProps = {
  width: number,
  height: number,
  theme: Theme,
};

/*
 * DataPoint
 */

export type DataPoint = {
  date: Date,
  [key: string]: number,
};

/*
 * FormatLabel
 */

export type FormatLabel = (label: string) => React.Node;
export type FormatLabelStr = (label: string) => string;

/*
 * Timerange
 */

export type Timerange = { start: ?Date, end: ?Date };

/*
 * OnApplyBrush
 */

export type OnApplyBrush = (Timerange) => void;

/*
 * TimeseriesChart
 */
export type ChartType = "bar" | "line";
export type YScaleType = "linear" | "log";
export type TimeseriesChartProps = {
  data: DataPoint[],
  height: number,
  chartType: ChartType,
  yScale: YScaleType,
  theme: Theme,
  minY: number,
  disabledKeys: string[],
  isLoading: boolean,
  onYAxisClick: (YScaleType) => void,
  onApplyBrush: OnApplyBrush,
  formatYTickLabel: FormatLabelStr,
};

/*
 * TimeseriesLegend
 */

export type TimeseriesLegendProps = {
  data: DataPoint[],
  theme: Theme,
  disabledKeys: string[],
  onClick: (label: string) => void,
  formatLabelText: FormatLabel,
  formatLegendTotal: FormatLabel,
};

/*
 * LegendTotal
 */

export type LegendTotalProps = {
  data: DataPoint[],
  label: string,
  formatLegendTotal: FormatLabel,
};

/*
 * Chart
 */

export type ChartProps = {
  data: DataPoint[],
  keys: string[],
  xScaleChart: Object,
  yScale: Object,
  colorScale: Object,
  theme: Theme,
  chartType: ChartType,
  getDate: (DataPoint) => Date,
};

/*
 * ChartInteractions
 */

export type ChartInteractionsProps = {
  data: DataPoint[],
  xScaleTime: Object,
  xScaleChart: Object,
  yScale: Object,
  xMax: number,
  yMax: number,
  pointWidth: number,
  margin: Margin,
  theme: Theme,
  onApplyBrush: OnApplyBrush,
  getDate: (DataPoint) => Date,
};

/*
 * Brush
 */

export type BrushProps = {
  data: DataPoint[],
  xScaleTime: Object,
  yScale: Object,
  xMax: number,
  yMax: number,
  margin: Margin,
  onClearBrush: () => void,
  getDate: (DataPoint) => Date,
};

/*
 * BrushActions
 */

export type BrushActionsProps = {
  xMax: number,
  theme: Theme,
  onApplyBrush: (Timerange) => void,
  onClearBrush: () => void,
};

/*
 * BrushMask
 */

export type BrushMaskProps = {
  xScaleTime: Object,
  xMax: number,
  yMax: number,
  theme: Theme,
};

/*
 * ChartMarker
 */

export type ChartMarkerProps = {
  xScaleChart: Object,
  xMax: number,
  yMax: number,
  theme: Theme,
  markerWidth: number,
};

/*
 * ChartMarkerText
 */

export type ChartMarkerTextAlign = "start" | "middle" | "end";
export type ChartMarkerTextProps = {
  label: string,
  xPos: number,
  yMax: number,
  xMax: number,
  align: ChartMarkerTextAlign,
  theme: Theme,
};

/*
 * Axis
 */

export type AxisLeftProps = {
  scale: Object,
  yMax: number,
  yScale: YScaleType,
  theme: Theme,
  margin: Margin,
  onClick: (YScaleType) => void,
  formatTickLabel: FormatLabelStr,
};

export type AxisBottomProps = {
  yMax: number,
  scale: Object,
  theme: Theme,
  width: number,
};

/*
 * ChartContext
 */

export type ChartContextType = {
  hoverValue: ?Date,
  brushRange: Timerange,
  brushingRange: Timerange,
  setHoverValue: (?Date) => void,
  setBrushRange: (Timerange) => void,
  setBrushingRange: (Timerange) => void,
};

/*
 * LoadingProps
 */

export type LoadingProps = {
  isLoading: boolean,
  width: number,
  height: number,
  theme: Theme,
};
