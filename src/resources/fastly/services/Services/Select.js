// @flow

import * as React from "react";
import { SelectInput } from "cosmo";

export type OnChange = (serviceId: string) => void;
type Props = {
  resource: Object,
  value: string,
  label: string,
  onChange: OnChange,
};

const Select = (props: Props): React.Node => {
  const { resource, value, label, onChange } = props;
  const { state } = resource;

  if (state.rejected || !state.fulfilled) return null;

  const data = state.value;

  const options = data.map((d) => ({
    value: d.id,
    label: d.name,
    disabled: false,
  }));

  return (
    <SelectInput
      input={{
        name: "serviceId",
        id: "serviceId",
        value,
        onChange: (evt) => onChange(evt.currentTarget.value),
      }}
      label={label || ""}
      options={options}
    />
  );
};

export default Select;
