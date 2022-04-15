/* @flow */

import * as React from "react";
import { FormattedNumber as ReactIntlFormattedNumber } from "react-intl";
import { format } from "d3-format";

type Props = {
  value: number,
  compact?: boolean,
  precise?: boolean,
};

// inspo: https://github.com/d3/d3/issues/2241#issuecomment-150099953
export function formatCompact(
  originalValue: number,
  precise?: boolean
): string {
  const formatNumber = format(`.${precise ? 2 : 0}f`);
  const formatBillion = (val) => `${formatNumber(val / 1e9)}b`;
  const formatMillion = (val) => `${formatNumber(val / 1e6)}m`;
  const formatThousand = (val) => `${formatNumber(val / 1e3)}k`;
  const formatHundred = (val) => `${formatNumber(val)}`;
  let formatFunc = null;

  const absValue = Math.abs(originalValue);
  if (absValue >= 0.9995e9) {
    // round up after 999,500,000
    formatFunc = formatBillion;
  } else if (absValue >= 0.9995e6) {
    // round up after 999,500
    formatFunc = formatMillion;
  } else if (absValue >= 0.9995e3) {
    // round up after 999.5
    formatFunc = formatThousand;
  } else {
    formatFunc = formatHundred;
  }

  return formatFunc(originalValue);
}

const FormattedNumber = ({ value, compact, precise, ...rest }: Props) => {
  return compact ? (
    <span title={value} {...rest}>
      {formatCompact(value, precise)}
    </span>
  ) : (
    <ReactIntlFormattedNumber
      value={value}
      compact={compact}
      precise={precise}
      {...rest}
    />
  );
};

FormattedNumber.defaultProps = {
  precise: false,
  compact: false,
};

export default FormattedNumber;
