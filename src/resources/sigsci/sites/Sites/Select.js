// @flow

import * as React from "react";
import { SelectInput } from "cosmo";

export type OnChange = (siteName: string) => void;
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

  const { data } = state.value;

  const options = data.map((d) => ({
    value: d.name,
    label: d.displayName,
    disabled: false,
  }));

  return (
    <SelectInput
      input={{
        name: "site",
        id: "site",
        value,
        onChange: (evt) => onChange(evt.currentTarget.value),
        required: true,
      }}
      label={label || ""}
      options={options}
    />
  );
};

export default Select;
