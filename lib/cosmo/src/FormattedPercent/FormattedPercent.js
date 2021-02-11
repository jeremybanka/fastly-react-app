/* @flow */

import * as React from "react";
import { format } from "d3-format";

type Props = {
  value: number,
  precise?: boolean,
};

export function formatPercent(originalValue: number, precise: boolean): string {
  if (precise && originalValue > 0 && originalValue < 0.0001) {
    return "<0.01%";
  }
  if (!precise && originalValue > 0 && originalValue < 0.005) {
    return "<1%";
  }
  const formatFunc = format(`.${precise ? 2 : 0}%`);
  return formatFunc(originalValue);
}

const FormattedPercent = ({ value, precise, ...rest }: Props): React.Node => {
  return <span {...rest}>{formatPercent(value, precise)}</span>;
};

FormattedPercent.defaultProps = {
  precise: false,
};

export default FormattedPercent;
