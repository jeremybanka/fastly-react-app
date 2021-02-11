// @flow

import * as React from "react";
import { SelectInput } from "cosmo";

export type OnChange = (region: string) => void;
type Props = {
  value: string,
  onChange: OnChange,
};
function RegionSelect(props: Props): React.Node {
  const { value, onChange } = props;

  return (
    <SelectInput
      value=""
      label=""
      input={{
        name: "region",
        id: "region",
        value,
        onChange: (evt) => onChange(evt.currentTarget.value),
      }}
      options={[
        {
          value: "all",
          label: "All regions",
        },
        {
          value: "usa",
          label: "Continental United States",
        },
        { value: "europe", label: "Europe" },
        {
          value: "anzac",
          label: "Australia and New Zealand",
        },
        { value: "asia", label: "Asia" },
        { value: "asia_india", label: "India" },
        { value: "latam", label: "Brazil" },
        {
          value: "south_africa",
          label: "Southern Africa",
        },
        {
          value: "southamerica_std",
          label: "South America",
        },
      ]}
    />
  );
}

export default RegionSelect;
