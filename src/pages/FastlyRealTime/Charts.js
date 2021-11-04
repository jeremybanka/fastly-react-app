// @flow

import * as React from "react";
import { ChartProvider } from "rvis";
import {
  formatBytes,
  formatNumber,
  formatPercent,
  styled,
  themeGet,
  css,
} from "cosmo";
import { RealTime } from "../../resources/fastly/realtime";
import { ChartWrapper } from "../../components"
import type { Chart } from "../../components/ChartWrapper";
import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";

const height = 200;

const Grid = styled("div")((props) => {
  return css({
    display: "grid",
    width: "100%",
    gridTemplateColumns: [
      "repeat(1, minmax(auto, 1fr))",
      "",
      "repeat(2, minmax(auto, 1fr))",
      "repeat(3, minmax(auto, 1fr))",
    ],
    gap: themeGet("space.xl", "")(props),
  });
});

const GridItem = styled.div`
  overflow: hidden;
`;

const charts: Chart[] = [
  {
    id: "rt-requests",
    title: "Requests",
    subtitle: "Number of requests processed each second",
    metrics: ["requests"],
    chartType: "line",
    format: "number",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
  {
    id: "rt-errors",
    title: "Errors",
    subtitle: "Number of errors returned each second",
    metrics: ["errors"],
    chartType: "line",
    format: "number",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
  {
    id: "rt-status",
    title: "Response Status",
    subtitle: "Status counts returned each second",
    metrics: ["status_2xx","status_3xx","status_4xx","status_5xx"],
    chartType: "bar",
    format: "number",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
  {
    id: "rt-bandwidth",
    title: "Bandwidth",
    subtitle: "Number of bytes transferred per second",
    metrics: ["bandwidth"],
    chartType: "bar",
    format: "bytes",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
  {
    id: "rt-logs",
    title: "Logs",
    subtitle: "Number of logs sent to endpoints from Fastly",
    metrics: ["logging"],
    chartType: "line",
    format: "number",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
  {
    id: "rt-ratio",
    title: "Hit Ratio",
    subtitle: "Percentage of requests being delivered from cache",
    metrics: ["hit_ratio"],
    chartType: "line",
    format: "percent",
    disabledMetrics: [],
    handleLegendItemClick: () => {},
  },
];

type Props = {
  params: {
    serviceId: string,
    datacenter: string,
  },
  query?: {
    from?: number,
    until?: number,
  },
  onTimerangeChange: HandleTimeRangeChange,
  onDatacentersUpdated?: (datacenters: string[]) => void,
};
const FastlyRealTimeCharts = (props: Props): React.Node => {
  const [yScale, setYScale] = React.useState<"linear" | "log">("linear");
  const { params, query, onTimerangeChange, onDatacentersUpdated } = props;
  const { serviceId, datacenter } = params;
  const seconds:integer = 120;

  const valueAsNumber = (value: string): number =>
    parseFloat(value.split(",").join(""));
  const isPrecise = (value: number): boolean => value >= 1000;
  return (
    <ChartProvider>
      <Grid>
        <RealTime key={serviceId} params={{ serviceId, limit: seconds }}>
          {(rsrc) =>
            <RealTime.Poller 
              params={{ serviceId, datacenter, limit: seconds }} 
              resource={rsrc} 
              query={query}
              onDatacentersUpdated={onDatacentersUpdated}
            >
              {({dataset}) =>
                charts.map((chart) => (
                  <GridItem key={chart.id}>
                    <ChartWrapper defaultChart={chart} api="rt" params={{ siteName: ''}}>
                      {({
                        chartType,
                        metrics,
                        format,
                        theme,
                        disabledMetrics,
                        handleLegendItemClick
                      }) => (
                        <RealTime.Chart
                          dataset={dataset}
                          height={height}
                          yScale={yScale}
                          chartType={chartType}
                          theme={theme}
                          minY={format === "percent" ? 1 : 10}
                          disabledMetrics={disabledMetrics}
                          onLegendItemClick={handleLegendItemClick}
                          onYAxisClick={(currentScale) =>
                            setYScale(currentScale === "linear" ? "log" : "linear")
                          }
                          onApplyBrush={({ start, end }) =>
                            onTimerangeChange({
                              from: start ? start.getTime().toString() : "",
                              until: end ? end.getTime().toString() : "",
                            })
                          }
                          formatYTickLabel={(label) => {
                            if (format === "bytes") {
                              return formatBytes(valueAsNumber(label));
                            }
                            if (format === "percent") {
                              return formatPercent(valueAsNumber(label));
                            }
                            return formatNumber(
                              valueAsNumber(label),
                              isPrecise(valueAsNumber(label))
                            );
                          }}
                          formatLegendTotalLabel={(label) => {
                            if (format === "bytes") {
                              return formatBytes(valueAsNumber(label));
                            }
                            if (format === "percent") {
                              return formatPercent(valueAsNumber(label));
                            }
                            return formatNumber(
                              valueAsNumber(label),
                              isPrecise(valueAsNumber(label))
                            );
                          }}
                          metrics={metrics}
                        />
                      )}
                    </ChartWrapper>
                  </GridItem>
                ))
              }
            </RealTime.Poller>
          }
        </RealTime>
      </Grid>
    </ChartProvider>
  );
}

export default FastlyRealTimeCharts;