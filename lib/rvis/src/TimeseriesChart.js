// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import {
  scaleTime,
  scaleBand,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
} from "@visx/scale";
import {
  AxisX,
  AxisY,
  Background,
  Chart,
  ChartInteractions,
  Loading,
} from "./components";
import defaultTheme from "./theme";
import type { TimeseriesChartProps } from "./types";

// accessors
const getDate = (data): Date => data.date;

function TimeseriesChart(props: TimeseriesChartProps): React.Node {
  const {
    data = [],
    height = 480,
    chartType = "bar",
    yScale = "linear",
    theme = defaultTheme,
    minY = 10,
    disabledKeys = [],
    isLoading = false,
    onYAxisClick = () => undefined,
    formatYTickLabel = (label) => label,
    onApplyBrush = () => undefined,
  } = props;

  if (data.length < 1) return null;

  const { space, colors } = theme;
  const margin = {
    top: space.small,
    right: 0,
    bottom: space.large,
    left: space.large,
  };

  return (
    <ParentSize>
      {({ width }) => {
        const xMax: number = Math.max(width - margin.left, 0);
        const yMax: number = Math.max(height - margin.top - margin.bottom, 0);

        const keys: string[] = Object.keys(data[0]).filter((d) => d !== "date");

        let dataFinal = data.slice();
        if (
          disabledKeys.length > 0 &&
          keys.some((k) => disabledKeys.includes(k))
        ) {
          dataFinal = dataFinal.map((d) => {
            const datum = d;
            disabledKeys.forEach((k) => {
              datum[k] = 0;
            });
            return datum;
          });
        }

        // get the max height of the date points (could be stacked)
        const pointTotals: number[] = dataFinal.map((d) => {
          let pointTotal = 0;

          // If this is a barchart then iterate keys to sum all the counts for
          // the point (could be stacked bars)
          if (chartType === "bar") {
            keys.forEach((key) => {
              pointTotal += d[key];
            });
          }

          // If this is a line chart then get the highest count for the point
          if (chartType === "line") {
            pointTotal = Math.max(...keys.map((key) => d[key]));
          }
          return pointTotal;
        });
        const pointMax: number = React.useMemo(() => Math.max(...pointTotals), [
          pointTotals,
        ]);

        // scales
        const xScaleTime = React.useMemo(
          () =>
            scaleTime<string>({
              domain: [
                getDate(dataFinal[0]),
                getDate(dataFinal[dataFinal.length - 1]),
              ],
              range: [0, xMax],
            }),
          [dataFinal, xMax]
        );
        const xScaleBand = React.useMemo(
          () =>
            scaleBand<string>({
              domain: dataFinal.map(getDate),
              range: [0, xMax],
              paddingInner: 0.3,
            }),
          [dataFinal, xMax]
        );
        const yScaleLinear = React.useMemo(
          () =>
            scaleLinear<number>({
              domain: [0, Math.max(pointMax, pointMax > 0 ? 1 : minY)],
              range: [yMax, 0],
            }),
          [pointMax, yMax]
        );
        const yScaleLog = React.useMemo(
          () =>
            scaleLog<number>({
              domain: [0.1, Math.max(pointMax, pointMax > 0 ? 1 : minY)],
              range: [yMax, 0],
              clamp: true,
              base: Math.E,
            }),
          [pointMax, yMax]
        );
        const colorScale = React.useMemo(
          () =>
            scaleOrdinal<string, string>({
              domain: keys,
              range: colors.charts,
            }),
          [keys, colors]
        );

        // bar chart uses a band scale while line uses a time scale
        const xScaleChart = chartType === "bar" ? xScaleBand : xScaleTime;
        // set the yScale variant
        const activeYScale = yScale === "linear" ? yScaleLinear : yScaleLog;

        return (
          <svg width={width} height={height}>
            <Background width={width} height={height} theme={theme} />
            <Group left={margin.left} top={margin.top}>
              <GridRows
                scale={activeYScale}
                width={xMax}
                height={yMax}
                stroke={colors.muted}
                strokeDasharray="2"
                // set ticks to start, middle, end values
                tickValues={[
                  ...activeYScale.domain(),
                  activeYScale.domain()[1] / 2,
                ]}
              />
              <Chart
                keys={keys}
                data={dataFinal}
                xScaleChart={xScaleChart}
                yScale={activeYScale}
                colorScale={colorScale}
                theme={theme}
                chartType={chartType}
                getDate={getDate}
              />
              <ChartInteractions
                data={dataFinal}
                xScaleTime={xScaleTime}
                xScaleChart={xScaleChart}
                yScale={activeYScale}
                xMax={xMax}
                yMax={yMax}
                pointWidth={xScaleChart.bandwidth ? xScaleChart.bandwidth() : 1}
                margin={margin}
                theme={theme}
                getDate={getDate}
                onApplyBrush={onApplyBrush}
              />
              <Loading
                isLoading={isLoading}
                width={xMax}
                height={yMax}
                theme={theme}
              />
              <AxisY
                scale={activeYScale}
                yMax={yMax}
                yScale={yScale}
                theme={theme}
                margin={margin}
                formatTickLabel={formatYTickLabel}
                onClick={onYAxisClick}
              />
              <AxisX
                scale={xScaleTime}
                yMax={yMax}
                theme={theme}
                width={width}
              />
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}

export default TimeseriesChart;
