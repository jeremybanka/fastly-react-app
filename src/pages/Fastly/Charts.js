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
import { Stats } from "../../resources/fastly/stats";
import { ChartWrapper } from "../../components";
import type { OnChange as HandleTimeRangeChange } from "../../components/TimerangePresets";
import type { Chart } from "../../components/ChartWrapper";

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
    id: "requests",
    title: "Total Requests",
    subtitle: "Number of requests processed",
    metrics: ["requests"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "bandwidth-delivered",
    title: "Bandwidth Delivered",
    subtitle: "Total bytes delivered",
    metrics: [
      "resp_header_bytes",
      "resp_body_bytes",
      "bereq_header_bytes",
      "bereq_body_bytes",
    ],
    chartType: "bar",
    format: "bytes",
  },
  {
    id: "cache-stats",
    title: "Cache Summary",
    subtitle: "Overview of cache activity per request",
    metrics: ["hits", "miss", "pass", "errors"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "hit-ratio",
    title: "Cache Hit Ratio",
    subtitle: "Percentage of cache hits to all cacheable content",
    metrics: ["hit_ratio"],
    chartType: "line",
    format: "percent",
  },
  {
    id: "response-codes",
    title: "Response Status Codes",
    subtitle: "Number of responses sent by status group",
    metrics: [
      "status_1xx",
      "status_2xx",
      "status_3xx",
      "status_4xx",
      "status_5xx",
    ],
    chartType: "bar",
    format: "number",
  },
  {
    id: "bandwidth-origin",
    title: "Bandwidth To Origin",
    subtitle: "Request header and body bytes sent to the origin",
    metrics: ["origin_fetch_header_bytes", "origin_fetch_body_bytes"],
    chartType: "bar",
    format: "bytes",
  },
];

type Props = {
  params: {
    serviceId: string,
  },
  query: {
    from: string,
    to: string,
    region: string,
  },
  onTimerangeChange: HandleTimeRangeChange,
};
function FastlyCharts(props: Props): React.Node {
  const [yScale, setYScale] = React.useState<"linear" | "log">("linear");
  const { params, query, onTimerangeChange } = props;
  const { serviceId } = params;
  const { from, to, region } = query;

  const valueAsNumber = (value: string): number =>
    parseFloat(value.split(",").join(""));
  const isPrecise = (value: number): boolean => value >= 1000;

  return (
    <ChartProvider>
      <Grid>
        <Stats params={{ serviceId }} query={{ from, to, region }}>
          {(rsrc) =>
            charts.map((chart) => (
              <GridItem key={chart.id}>
                <ChartWrapper defaultChart={chart} api="fastly">
                  {({
                    chartType,
                    metrics,
                    format,
                    theme,
                    disabledMetrics,
                    handleLegendItemClick,
                  }) => (
                    <Stats.Chart
                      resource={rsrc}
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
        </Stats>
      </Grid>
    </ChartProvider>
  );
}

export default FastlyCharts;
