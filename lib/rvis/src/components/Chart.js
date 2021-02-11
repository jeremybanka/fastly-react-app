// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { BarStack, LinePath } from "@visx/shape";
import type { ChartProps } from "../types";

function Chart(props: ChartProps): React.Node {
  const {
    data,
    keys,
    xScaleChart,
    yScale,
    colorScale,
    theme,
    chartType,
    getDate,
  } = props;
  const { colors } = theme;

  if (chartType === "bar") {
    return (
      <BarStack
        data={data}
        keys={keys}
        x={getDate}
        xScale={xScaleChart}
        yScale={yScale}
        color={colorScale}
      >
        {(barStacks) =>
          barStacks.map((barStack) =>
            barStack.bars.map((bar) => (
              <rect
                key={`bar-stack-${barStack.index}-${bar.index}`}
                x={bar.x}
                y={bar.y}
                height={bar.height}
                width={bar.width}
                fill={bar.color}
              />
            ))
          )
        }
      </BarStack>
    );
  }

  if (chartType === "line") {
    return (
      <>
        {keys.map((k, idx) => (
          <LinePath
            key={`linepath-${k}`}
            data={data}
            x={(d) => xScaleChart(getDate(d)) || 0}
            y={(d) => yScale(d[k]) || 0}
            stroke={colors.charts[idx]}
            strokeWidth={2}
          />
        ))}
      </>
    );
  }

  return null;
}

export default Chart;
