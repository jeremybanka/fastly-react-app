// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { LegendTotal } from "./components";
import defaultTheme from "./theme";
import type { TimeseriesLegendProps } from "./types";

function TimeseriesLegend(props: TimeseriesLegendProps): React.Node {
  const {
    data = [],
    theme = defaultTheme,
    onClick,
    disabledKeys = [],
    formatLabelText = (label) => label,
    formatLegendTotal = (total) => total,
  } = props;

  const { space, colors, fonts } = theme;
  const keys: string[] = Object.keys(data[0]).filter((d) => d !== "date");

  const colorScale = React.useMemo(
    () =>
      scaleOrdinal<string, string>({
        domain: keys,
        range: colors.charts,
      }),
    [keys, colors]
  );

  if (data.length < 1) return null;

  return (
    <LegendOrdinal scale={colorScale}>
      {(labels) =>
        labels.map((label) => {
          const isDisabled = disabledKeys.includes(label.text);
          return (
            <LegendItem
              key={label.text}
              margin={`${space.small}px 0`}
              onClick={() => onClick(label.text)}
            >
              <svg width={space.small} height={space.small}>
                <rect
                  fill={isDisabled ? colors.muted : label.value}
                  width={space.small}
                  height={space.small}
                />
              </svg>
              <LegendLabel align="left" margin={`0 0 0 ${space.small}px`}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    lineHeight: "24px",
                    color: isDisabled ? colors.muted : "inherit",
                  }}
                >
                  <span style={{ fontFamily: fonts.sans }}>
                    {formatLabelText(label.text)}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                    }}
                  >
                    <LegendTotal
                      data={data}
                      label={label.text}
                      formatLegendTotal={formatLegendTotal}
                    />
                  </span>
                </div>
              </LegendLabel>
            </LegendItem>
          );
        })
      }
    </LegendOrdinal>
  );
}

export default TimeseriesLegend;
