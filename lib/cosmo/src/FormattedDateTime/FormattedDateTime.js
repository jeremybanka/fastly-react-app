/* @flow */

import * as React from "react";

import { FormattedDate, FormattedTime } from "../";

type Props = {
  value: string,
  showSeconds?: boolean, // Can be used with FormattedTime
};

const FormattedDateTime = ({
  value,
  showSeconds,
  ...rest
}: Props): React.Node => (
  <>
    <FormattedDate value={value} {...rest} />,{" "}
    <FormattedTime value={value} showSeconds={showSeconds} {...rest} />
  </>
);

FormattedDateTime.defaultProps = {
  showSeconds: false,
};

export default FormattedDateTime;
