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
import { Domains } from "../../resources/fastly/domains";
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
    id: "edge",
    title: "Edge by Domain",
    subtitle: "Number of requests from the edge to domain",
    metrics: ["edge"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "resp_body_bytes",
    title: "Response body bytes by Domain",
    subtitle: "Number of body bytes from domain.",
    metrics: ["resp_body_bytes"],
    chartType: "bar",
    format: "bytes",
  },
  {
    id: "resp_header_bytes",
    title: "Response header bytes by Domain",
    subtitle: "Number of header bytes from domain.",
    metrics: ["resp_header_bytes"],
    chartType: "bar",
    format: "bytes",
  },
  {
    id: "status_2xx",
    title: "2xx by Domain",
    subtitle: "Number of 2xx \"Success\" status codes delivered from domain.",
    metrics: ["status_2xx"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "status_3xx",
    title: "3xx by Domain",
    subtitle: "Number of 3xx \"Redirection\" codes delivered from domain.",
    metrics: ["status_3xx"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "status_4xx",
    title: "4xx by Domain",
    subtitle: "Number of 4xx \"Client Error\" codes delivered from domain.",
    metrics: ["status_4xx"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "status_5xx",
    title: "5xx by Domain",
    subtitle: "Number of 5xx \"Server Error\" codes delivered from domain.",
    metrics: ["status_5xx"],
    chartType: "bar",
    format: "number",
  },
];

type Props = {
  params: {
    serviceId: string,
  },
  query: {
    start: string,
    end: string,
    region: string,
  },
  onTimerangeChange: HandleTimeRangeChange,
};
function FastlyDomainsCharts(props: Props): React.Node {
  const [yScale, setYScale] = React.useState<"linear" | "log">("linear");
  const { params, query, onTimerangeChange } = props;
  const { serviceId } = params;
  const { start, end, region } = query;
  const metrics = charts.map((c) => {
    return c.metrics[0];
  });

  const valueAsNumber = (value: string): number =>
    parseFloat(value.split(",").join(""));
  const isPrecise = (value: number): boolean => value >= 1000;
  return (
    <ChartProvider>
      <Grid>
        <Domains params={{ serviceId }} query={{ start, end, region, metrics }}>
          {(rsrc) =>
            charts.map((chart) => (
              <GridItem key={chart.id}>
                <ChartWrapper defaultChart={chart} api="Domains">
                  {({
                    chartType,
                    metrics,
                    format,
                    theme,
                    disabledMetrics,
                    handleLegendItemClick,
                  }) => (
                    <Domains.Chart
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
        </Domains>
      </Grid>
    </ChartProvider>
  );
}

export default FastlyDomainsCharts;
