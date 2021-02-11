/* @flow */

import * as React from "react";
import { FormattedTime } from "../";

type Props = {
  startValue: any,
  endValue: any,
};

const FormattedTimeRange = ({
  startValue,
  endValue,
  ...rest
}: Props): React.Node => (
  <>
    <FormattedTime value={startValue} timeZoneName="none" {...rest} />
    &ndash;
    <FormattedTime value={endValue} {...rest} />
  </>
);

FormattedTimeRange.defaultProps = {};

export default FormattedTimeRange;
