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
import { Origins } from "../../resources/fastly/origins";
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
    id: "response",
    title: "Responses by Origin",
    subtitle: "Number of responses processed by each origin host",
    metrics: ["responses"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "status_2xx",
    title: "Status_2xx by Origin",
    subtitle: "Number of status 2xx codes returned by each origin host",
    metrics: ["status_2xx"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "status_5xx",
    title: "Status_5xx by Origin",
    subtitle: "Number of status 5xx codes returned by each origin host",
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
function FastlyOriginsCharts(props: Props): React.Node {
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
        <Origins params={{ serviceId }} query={{ start, end, region, metrics }}>
          {(rsrc) =>
            charts.map((chart) => (
              <GridItem key={chart.id}>
                <ChartWrapper defaultChart={chart} api="origins">
                  {({
                    chartType,
                    metrics,
                    format,
                    theme,
                    disabledMetrics,
                    handleLegendItemClick,
                  }) => (
                    <Origins.Chart
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
        </Origins>
      </Grid>
    </ChartProvider>
  );
}

export default FastlyOriginsCharts;
