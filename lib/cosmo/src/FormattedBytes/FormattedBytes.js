/* @flow */

import * as React from "react";

type Props = {
  value: number,
};

const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export function formatBytes(bytes: number) {
  // handle edge case
  if (bytes <= 0) {
    return `0${units[0]}`;
  }

  let i = Math.floor(Math.log(bytes) / Math.log(1024));

  // keep within bounds of the defined units
  if (i >= units.length) {
    i = units.length - 1;
  }

  const formattedBytes =
    i === 0
      ? (bytes / 1024 ** i).toFixed(0) // no precision needed for bytes
      : (bytes / 1024 ** i).toFixed(1); // default to one precision point

  return `${formattedBytes}${units[i]}`;
}

const FormattedBytes = ({ value, ...rest }: Props): React.Node => (
  <span className="FormattedBytes" {...rest}>
    {formatBytes(value)}
  </span>
);

export default FormattedBytes;
