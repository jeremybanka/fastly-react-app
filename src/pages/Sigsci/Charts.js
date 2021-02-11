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
import { RequestsTimeseries } from "../../resources/sigsci/timeseries";
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
    id: "request-anomalies",
    title: "Request Anomalies",
    subtitle: "Anomalous behaviors within request headers",
    chartType: "bar",
    format: "number",
    metrics: ["NULLBYTE", "IMPOSTOR", "NOUA", "NOTUTF8", "BLOCKED"],
  },
  {
    id: "response-anomalies",
    title: "Response Anomalies",
    subtitle: "Client and server error codes",
    chartType: "bar",
    format: "number",
    metrics: ["HTTP4XX", "HTTP403", "HTTP404", "HTTP5XX", "HTTP500", "HTTP503"],
  },
  {
    id: "scanners",
    title: "Scanners",
    subtitle: "Commercial and open source scanning tools",
    chartType: "bar",
    format: "number",
    metrics: ["USERAGENT", "BACKDOOR", "FORCEFULBROWSING", "PRIVATEFILE"],
  },
  {
    id: "traffic-source-anomalies",
    title: "Traffic Source Anomalies",
    subtitle: "Requests from unusual or suspicious sources",
    chartType: "bar",
    format: "number",
    metrics: ["SIGSCI-IP", "TORNODE", "DATACENTER", "SANS"],
  },
  {
    id: "authentication",
    title: "Authentication",
    subtitle: "Attempts to login to application endpoints",
    chartType: "bar",
    format: "number",
    metrics: [
      "LOGINATTEMPT",
      "LOGINFAILURE",
      "LOGINSUCCESS",
      "REGATTEMPT",
      "REGFAILURE",
      "REGSUCCESS",
    ],
  },
  {
    id: "owasp-injection-attacks",
    title: "OWASP Injection Attacks",
    subtitle: "The most common attacks from OWASP Top 10",
    chartType: "bar",
    format: "number",
    metrics: ["SQLI", "XSS", "CMDEXE", "TRAVERSAL"],
  },
];

type Props = {
  params: {
    siteName: string,
  },
  query: {
    from: string,
    until: string,
  },
  onTimerangeChange: HandleTimeRangeChange,
};
function SigsciCharts(props: Props): React.Node {
  const [yScale, setYScale] = React.useState<"linear" | "log">("linear");
  const { params, query, onTimerangeChange } = props;
  const { siteName } = params;
  const { from, until } = query;

  const valueAsNumber = (value: string): number =>
    parseFloat(value.split(",").join(""));
  const isPrecise = (value: number): boolean => value >= 1000;

  return (
    <ChartProvider>
      <Grid>
        {charts.map((chart) => (
          <GridItem key={chart.id}>
            <ChartWrapper
              defaultChart={chart}
              params={{ siteName }}
              api="sigsci"
            >
              {({
                chartType,
                metrics,
                theme,
                format,
                disabledMetrics,
                handleLegendItemClick,
              }) => (
                <RequestsTimeseries
                  params={{ siteName }}
                  query={{ from, until, tag: metrics }}
                >
                  {(rsrc) => (
                    <RequestsTimeseries.Chart
                      resource={rsrc}
                      siteName={siteName}
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
                    />
                  )}
                </RequestsTimeseries>
              )}
            </ChartWrapper>
          </GridItem>
        ))}
      </Grid>
    </ChartProvider>
  );
}

export default SigsciCharts;
