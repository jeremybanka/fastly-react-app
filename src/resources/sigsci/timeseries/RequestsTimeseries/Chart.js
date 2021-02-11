// @flow

import * as React from "react";
import { TimeseriesChart, TimeseriesLegend } from "rvis";
import transformData from "./transformData";
import { SiteTags } from "../../tags";
import { RequestRejected } from "../../../../components";
import { Box } from "cosmo";
import type { ChartType } from "../../../../components/ChartWrapper";

type YScale = "linear" | "log";
type FormatLabel = (label: string) => string;
type Props = {
  resource: Object,
  siteName: string,
  height: number,
  chartType: ChartType,
  yScale: YScale,
  theme: Object,
  minY: number,
  disabledMetrics: string[],
  onLegendItemClick: (label: string) => void,
  onYAxisClick: (currentScale: YScale) => void,
  onApplyBrush: ({ start: ?Date, end: ?Date }) => void,
  formatYTickLabel: FormatLabel,
  formatLegendLabel: (label: string) => React.Node,
  formatLegendTotalLabel: FormatLabel,
};

const Chart = (props: Props): React.Node => {
  const {
    resource,
    siteName,
    height,
    chartType,
    yScale,
    theme,
    minY,
    disabledMetrics = [],
    onLegendItemClick = () => undefined,
    onYAxisClick = () => undefined,
    onApplyBrush,
    formatYTickLabel = (value) => value,
    formatLegendTotalLabel = (value) => value,
  } = props;
  const { state } = resource;

  if (state.rejected) return <RequestRejected reason={state.reason.message} />;
  if (!state.fulfilled)
    return <Box height={height} backgroundColor="grays.1" />;

  const { data } = state.value;

  const transformedData = transformData(data);

  return (
    <>
      <TimeseriesChart
        height={height}
        data={transformedData}
        chartType={chartType}
        yScale={yScale}
        theme={theme}
        minY={minY}
        disabledKeys={disabledMetrics}
        isLoading={state.pending}
        onYAxisClick={onYAxisClick}
        onApplyBrush={onApplyBrush}
        formatYTickLabel={formatYTickLabel}
      />
      <TimeseriesLegend
        data={transformedData}
        disabledKeys={disabledMetrics}
        onClick={onLegendItemClick}
        formatLabelText={(label) => (
          <SiteTags params={{ siteName }}>
            {(rsrc) => <SiteTags.Label resource={rsrc} tagName={label} />}
          </SiteTags>
        )}
        formatLegendTotal={formatLegendTotalLabel}
        theme={theme}
      />
    </>
  );
};

export default Chart;
