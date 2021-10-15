// @flow

import * as React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Box, Button, Card, Flexbox, ThemeConsumer } from "cosmo";
import { ChartConfig } from "./";

export type ChartType = "bar" | "line";
export type ChartFormat = "number" | "bytes" | "percent";
export type Chart = {
  id: string,
  title: string,
  subtitle: string,
  metrics: string[],
  chartType: ChartType,
  format: ChartFormat,
};
type Props = {
  defaultChart: Chart,
  api: "sigsci" | "fastly" | "origins" | "domains" | "rt",
  params: {
    siteName: string,
  },
  children: ({
    chartType: ChartType,
    metrics: string[],
    format: ChartFormat,
    theme: Object,
  }) => React.Node,
};

function ChartWrapper(props: Props): React.Node {
  const { defaultChart, api, params = {}, children } = props;
  const [disabledMetrics, setDisabledMetrics] = React.useState<string[]>([]);
  const [chartConfig, setChartConfig] = useLocalStorage(
    defaultChart.id,
    defaultChart
  );
  const [showConfig, setShowConfig] = React.useState<boolean>(false);
  const { title, subtitle, metrics, format, chartType } = chartConfig;

  const handleInputChange = (id, value) =>
    // Update field within the config
    setChartConfig({
      ...chartConfig,
      [id]: value,
    });

  const handleLegendItemClick = (label) => {
    setDisabledMetrics(
      disabledMetrics.includes(label)
        ? disabledMetrics.filter((m) => m !== label)
        : [...disabledMetrics, label]
    );
  };

  return (
    <ThemeConsumer>
      {(theme) => {
        // map theme to expected shape
        const chartTheme = {
          fonts: {
            sans: theme.fonts.sans,
            mono: theme.fonts.mono,
          },
          space: {
            small: theme.space.sm,
            large: theme.space.xl,
          },
          colors: {
            text: theme.colors.grays[8], // black
            background: theme.colors.grays[0], // white
            muted: theme.colors.grays[2], // gray
            charts: theme.colors.charts,
          },
        };
        return (
          <Card>
            <Card.Header>
              <Card.Title>
                <Flexbox alignItems="flex-end">
                  {/* title */}
                  <Box style={{ flex: 1 }}>{title || "-"}</Box>
                  {/* button */}
                  <Flexbox>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setShowConfig(!showConfig);
                      }}
                    >
                      Configure chart
                    </Button>
                  </Flexbox>
                </Flexbox>
              </Card.Title>
              <Card.Subtitle>{subtitle || "-"}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              {showConfig ? (
                <Box backgroundColor="grays.1" padding="md" marginBottom="md">
                  <ChartConfig
                    formValues={chartConfig}
                    api={api}
                    params={params}
                    onInputChange={handleInputChange}
                    onSubmit={() => setShowConfig(false)}
                    onReset={() => setChartConfig(defaultChart)}
                  />
                </Box>
              ) : null}
              {children({
                chartType,
                metrics,
                format,
                theme: chartTheme,
                disabledMetrics,
                handleLegendItemClick,
              })}
            </Card.Body>
          </Card>
        );
      }}
    </ThemeConsumer>
  );
}

export default ChartWrapper;
