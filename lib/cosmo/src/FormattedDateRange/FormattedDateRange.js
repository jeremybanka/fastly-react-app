/* @flow */

import * as React from "react";
import { FormattedDate } from "../";

type Props = {
  startValue: any,
  endValue: any,
};

const FormattedDateRange = ({
  startValue,
  endValue,
  ...rest
}: Props): React.Node => (
  <>
    <FormattedDate value={startValue} month="short" {...rest} />
    &ndash;
    <FormattedDate value={endValue} month="short" {...rest} />
  </>
);

FormattedDateRange.defaultProps = {};

export default FormattedDateRange;
