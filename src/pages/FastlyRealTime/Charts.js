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
    title: "Requests",
    subtitle: "Number of requests processed each second",
    metrics: ["requests"],
    chartType: "bar",
    format: "number",
  },
  {
    id: "errors",
    title: "Errors",
    subtitle: "Number of errors returned each second",
    metrics: ["errors"],
    chartType: "bar",
    format: "number",
  },
];

type Props = {
  params: {
    serviceId: string,
  },
};
const FastlyRealTimeCharts = (props: Props): React.Node => {
  const [yScale, setYScale] = React.useState<"linear" | "log">("linear");
  const { params } = props;
  const { serviceId } = params;

  const metrics = charts.map(c => c.metrics[0]);

  const valueAsNumber = (value: string): number =>
    parseFloat(value.split(",").join(""));
  const isPrecise = (value: number): boolean => value >= 1000;
  return (
    <ChartProvider>
      <Grid>
        <RealTime params={{ serviceId }}>
          {(rsrc) =>
            <RealTime.Poller resource={rsrc}>
              {({dataset}) =>
                charts.map((chart) => (
                  <GridItem key={chart.id}>
                    <ChartWrapper defaultChart={chart} api="rt">
                      {({
                        chartType,
                        metrics,
                        format,
                        theme,
                        disabledMetrics,
                        handleLegendItemClick,
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
                          // onApplyBrush={({ start, end }) =>
                          //   onTimerangeChange({
                          //     from: start ? start.getTime().toString() : "",
                          //     until: end ? end.getTime().toString() : "",
                          //   })
                          // }
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