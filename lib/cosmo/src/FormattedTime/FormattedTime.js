/* @flow */

import * as React from "react";
import { FormattedTime as ReactIntlFormattedTime } from "react-intl";

/* subset of defaults from original FormattedTime */
// https://github.com/flowtype/flow-typed/blob/master/definitions/npm/react-intl_v2.x.x/flow_v0.53.x-/react-intl_v2.x.x.js#L108
type Props = {
  value: number | string | Date,
  hour?: "numeric",
  minute?: "numeric",
  second?: "numeric",
  showSeconds?: boolean,
  timeZoneName?: "short" | "none",
};

const FormattedTime = ({
  value,
  hour,
  minute,
  second,
  showSeconds,
  timeZoneName,
  ...rest
}: Props): React.Node => (
  <ReactIntlFormattedTime
    value={value}
    hour={hour}
    minute={minute}
    second={showSeconds ? second : undefined}
    timeZoneName={timeZoneName === "none" ? undefined : "short"}
    {...rest}
  />
);

FormattedTime.defaultProps = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  showSeconds: false,
  timeZoneName: "short",
};

export default FormattedTime;
