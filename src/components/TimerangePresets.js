// @flow

import * as React from "react";
import { Button, Flexbox } from "cosmo";

const minute: number = 60 * 1000;
const hour: number = minute * 60;
const day: number = hour * 24;

export type Timerange = { from: string, until: string };
export type Option = { timerange: Timerange, label: string };
export type OnChange = (timerange: Timerange) => void;
type Props = {
  options?: Option[],
  onChange: OnChange,
};

const defaultOptions: Option[] = [
  {
    timerange: { from: (Date.now() - 1 * hour).toString(), until: "" },
    label: "1 hour ago",
  },
  {
    timerange: { from: (Date.now() - 6 * hour).toString(), until: "" },
    label: "1 day ago",
  },
  {
    timerange: { from: (Date.now() - 1 * day).toString(), until: "" },
    label: "7 days ago",
  },
  {
    timerange: { from: (Date.now() - 3 * day).toString(), until: "" },
    label: "1 month ago",
  },
  {
    timerange: { from: (Date.now() - 90 * day).toString(), until: "" },
    label: "3 months ago",
  },
];

function TimerangePresets(props: Props): React.Node {
  const { options = defaultOptions, onChange } = props;

  return (
    <Flexbox flexWrap="wrap" gap="xs">
      {options.map((item) => {
        return (
          <Button
            key={JSON.stringify(item.timerange)}
            variant="secondary"
            onClick={() => onChange(item.timerange)}
          >
            {item.label}
          </Button>
        );
      })}
    </Flexbox>
  );
}

export default TimerangePresets;
