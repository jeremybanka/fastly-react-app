// @flow

import * as React from "react";
import { FormattedDate, Text } from "cosmo";
import type { Timerange } from "./TimerangePresets";

type Props = {
  timerange: Timerange,
};

function TimerangeDisplay(props: Props): React.Node {
  const { timerange } = props;

  return (
    <Text fontSize="xs">
      📅{" "}
      <FormattedDate
        value={Number(timerange.from)}
        month="short"
        hour="numeric"
        minute="numeric"
      />{" "}
      &ndash;{" "}
      <FormattedDate
        value={timerange.until ? Number(timerange.until) : Date.now()}
        month="short"
        hour="numeric"
        minute="numeric"
        timeZoneName="short"
      />
    </Text>
  );
}

export default TimerangeDisplay;
