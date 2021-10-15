// @flow

import * as React from "react";
import { TimeseriesChart, TimeseriesLegend } from "rvis";
import transformData from "./transformData";
import type { ChartType } from "../../../../components/ChartWrapper";

type YScale = "linear" | "log";
type FormatLabel = (label: string) => string;
type Props = {
  dataset: Object,
  height: number,
  metrics: string[],
  chartType: ChartType,
  yScale: YScale,
  theme: Object,
  minY: number,
  disabledMetrics: string[],
  onLegendItemClick?: (label: string) => void,
  onYAxisClick?: (currentScale: YScale) => void,
  onApplyBrush?: ({ start: Date, end: Date }) => void,
  formatYTickLabel?: FormatLabel,
  formatLegendLabel?: FormatLabel,
  formatLegendTotalLabel?: FormatLabel,
};

const Chart = (props: Props): React.Node => {
  const {
    dataset,
    height,
    metrics,
    chartType,
    yScale,
    theme,
    minY,
    disabledMetrics = [],
    onLegendItemClick = () => undefined,
    onYAxisClick = () => undefined,
    onApplyBrush = () => undefined,
    formatYTickLabel = (value) => value,
    formatLegendLabel = (label) => label,
    formatLegendTotalLabel = (value) => value,
  } = props;
  
  const transformedData = transformData(dataset, metrics);

  return (
    <>
      <TimeseriesChart
        height={height}
        data={transformedData}
        chartType={chartType}
        yScale={yScale}
        onYAxisClick={onYAxisClick}
        onApplyBrush={onApplyBrush}
        theme={theme}
        minY={minY}
        disabledKeys={disabledMetrics}
        formatYTickLabel={formatYTickLabel}
      />
      <TimeseriesLegend
        data={transformedData}
        disabledKeys={disabledMetrics}
        onClick={onLegendItemClick}
        formatLabelText={formatLegendLabel}
        formatLegendTotal={formatLegendTotalLabel}
        theme={theme}
      />
    </>
  );
};

export default Chart;
