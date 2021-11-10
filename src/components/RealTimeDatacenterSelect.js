// @flow

import * as React from "react";
import { SelectInput } from "cosmo";

export type OnUpdate = (datacenters: string[]) => void;
export type OnChange = (datacenter: string) => void;

type Props = {
  datacenters: string[],
  value: string,
  onChange: (datacenter: string) => void,
};

const RealTimeDatacenterSelect = (props: Props): React.Node => {
  const { value, datacenters, onChange } = props;

  const options = [
    { 
      value: "", 
      label: "Aggregated",
      disabled: false,
    },
    ...datacenters.map((dc) => ({
      value: dc,
      label: `${dc} Datacenter`,
      disabled: false,
    }))
  ];

  return (
    <SelectInput
      input={{
        name: "datacenterId",
        id: "datacenterId",
        value: value || "",
        onChange: (evt) => onChange(evt.currentTarget.value),
      }}
      label=""
      options={options}
    />
  );
};

export default RealTimeDatacenterSelect;