// @flow

import * as React from "react";
import { TimeseriesChart, TimeseriesLegend } from "rvis";
import transformData from "./transformData";
import { RequestRejected } from "../../../../components";
import { Box } from "cosmo";
import type { ChartType } from "../../../../components/ChartWrapper";

type YScale = "linear" | "log";
type FormatLabel = (label: string) => string;
type Props = {
  resource: Object,
  height: number,
  metrics: string[],
  chartType: ChartType,
  yScale: YScale,
  theme: Object,
  minY: number,
  disabledMetrics: string[],
  onLegendItemClick: (label: string) => void,
  onYAxisClick: (currentScale: YScale) => void,
  onApplyBrush: ({ start: Date, end: Date }) => void,
  formatYTickLabel: FormatLabel,
  formatLegendLabel?: FormatLabel,
  formatLegendTotalLabel: FormatLabel,
};

const Chart = (props: Props): React.Node => {
  const {
    resource,
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
  const { state } = resource;

  if (state.rejected) return <RequestRejected reason={state.reason.message} />;
  if (!state.fulfilled)
    return <Box height={height} backgroundColor="grays.1" />;

  const { value } = state;

  const transformedData = transformData(value, metrics);

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
        isLoading={state.pending}
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
