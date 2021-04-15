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

const ServiceSelect = (props: Props): React.Node => {
  const { resource, value, label, onChange } = props;
  const { state } = resource;

  if (state.rejected || !state.fulfilled) return null;

  const { services } = state.value;

  if (!services) {
    return null;
  }

  const serviceIds = Object.keys(services);

  if (serviceIds.length === 0) return null;

  const options = serviceIds.map((id) => ({
    value: id,
    label: services[id],
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

export default ServiceSelect;
