/* @flow */

import * as React from "react";
import { FormattedDate as ReactIntlFormattedDate } from "react-intl";

/* subset of defaults from original FormattedDate */
// https://github.com/flowtype/flow-typed/blob/master/definitions/npm/react-intl_v2.x.x/flow_v0.53.x-/react-intl_v2.x.x.js#L108
type Props = {
  value: number | string | Date,
  month?: "short" | "long",
  day?: "numeric",
  year?: "numeric",
};

const FormattedDate = ({
  value,
  month,
  day,
  year,
  ...rest
}: Props): React.Node => (
  <ReactIntlFormattedDate
    value={value}
    month={month}
    day={day}
    year={year}
    {...rest}
  />
);

FormattedDate.defaultProps = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

export default FormattedDate;
