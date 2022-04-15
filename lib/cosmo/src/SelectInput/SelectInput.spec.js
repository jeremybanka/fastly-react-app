/* @flow */

import React from "react";
import { render, shallow } from "enzyme";
import { InputLabel, InputHelper, InputError } from "components";
import SelectInput from "./SelectInput";

const handleBlur = jest.fn();
const handleChange = jest.fn();
const basicInputObject = {
  name: "tastes",
  id: "tastes-umami",
  checked: true,
  onChange: handleChange,
  onBlur: handleBlur,
};
const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

describe("SelectInput test suite", () => {
  it("renders the stored snapshot", () => {
    const component = (
      <SelectInput
        label="Umami"
        input={basicInputObject}
        options={options}
        helper="Mystery flavor"
      />
    );
    expect(render(component)).toMatchSnapshot();
  });

  it("renders with InputLabel", () => {
    const component = (
      <SelectInput label="Foo" input={basicInputObject} options={options} />
    );
    expect(shallow(component).find(InputLabel)).toHaveLength(1);
  });

  it("renders with InputHelper", () => {
    const component = (
      <SelectInput input={basicInputObject} options={options} helper="Bar" />
    );
    expect(shallow(component).find(InputHelper)).toHaveLength(1);
  });

  it("renders with InputError", () => {
    const component = (
      <SelectInput input={basicInputObject} options={options} error="Foo" />
    );
    expect(shallow(component).find(InputError)).toHaveLength(1);
  });

  it("renders without InputLabel, InputHelper, or InputError", () => {
    const component = (
      <SelectInput input={basicInputObject} options={options} />
    );
    expect(shallow(component).find(InputLabel)).toHaveLength(0);
    expect(shallow(component).find(InputHelper)).toHaveLength(0);
    expect(shallow(component).find(InputError)).toHaveLength(0);
  });
});
