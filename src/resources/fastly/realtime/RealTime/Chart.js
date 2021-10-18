// @flow

import * as React from "react";
import { TimeseriesChart, TimeseriesLegend } from "rvis";
import type { ChartType } from "../../../../components/ChartWrapper";
import _ from 'lodash';

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
  
  const formattedData = _.takeRight(dataset, 120).map((record) => _.pick(record, ['date', ...metrics]))

  return (
    <>
      <TimeseriesChart
        height={height}
        data={formattedData}
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
        data={formattedData}
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
