// @flow

// eslint-disable-next-line import/no-unresolved
import * as React from "react";
import { ChartContext } from "../ChartProvider";
import type { LegendTotalProps } from "../types";

function LegendTotal(props: LegendTotalProps): React.Node {
  const { hoverValue, brushingRange } = React.useContext(ChartContext);
  const { data, label, formatLegendTotal } = props;

  let total = data.reduce((acc, d) => {
    let keyTotal = acc;
    keyTotal += d[label];
    return keyTotal;
  }, 0);

  if (brushingRange.start && brushingRange.end) {
    const brushStartIdx = data.findIndex(
      (d) => d.date.valueOf() === (brushingRange.start || "").valueOf()
    );
    const brushEndIdx = data.findIndex(
      (d) => d.date.valueOf() === (brushingRange.end || "").valueOf()
    );
    const brushData = data.slice(brushStartIdx, brushEndIdx + 1);

    total = brushData.reduce((acc, d) => {
      let keyTotal = acc;
      keyTotal += d[label];
      return keyTotal;
    }, 0);
  }

  const hoveredDatum = hoverValue
    ? data.find((d) => d.date.valueOf() === hoverValue.valueOf())
    : null;

  if (hoveredDatum) {
    total = hoveredDatum[label];
  }

  return formatLegendTotal(total.toString());
}

export default LegendTotal;
