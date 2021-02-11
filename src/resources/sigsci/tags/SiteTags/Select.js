// @flow

import * as React from "react";
import { MultiSelectInput } from "../../../../components";
import type { OptionType } from "../../../../components/MultiSelectInput";

type Props = {
  resource: Object,
  value: string[],
  onChange: (options: OptionType[]) => void,
};

const Select = (props: Props): React.Node => {
  const { resource, value, onChange } = props;
  const { state } = resource;

  if (state.rejected) return null;

  const data = state.value ? state.value.data : [];

  const options: OptionType[] = data
    .filter((d) => d.enabled)
    .map((d) => ({
      value: d.tagName,
      label: d.scope ? `${d.shortName} (${d.scope})` : d.shortName,
      description: d.description || "",
    }));

  return (
    <MultiSelectInput
      value={value}
      options={options}
      isLoading={state.pending}
      onChange={onChange}
    />
  );
};

export default Select;
