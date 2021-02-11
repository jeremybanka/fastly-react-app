/* @flow */

import React from "react";
import { render, shallow } from "enzyme";
import { InputValue, InputValueHelper } from "components";
import RadioInput from "./RadioInput";

const handleBlur = jest.fn();
const handleChange = jest.fn();
const basicInputObject = {
  name: "fruit",
  id: "fruit-apple",
  value: "apple", // props.form.values.someName,
  checked: true,
  onChange: handleChange,
  onBlur: handleBlur,
};

describe("RadioInput test suite", () => {
  it("renders the stored snapshot", () => {
    const component = (
      <RadioInput
        label="Apple"
        input={basicInputObject}
        helper="Often crunchy"
      />
    );
    expect(render(component)).toMatchSnapshot();
  });

  it("renders with InputValue", () => {
    const component = <RadioInput label="Foo" input={basicInputObject} />;
    expect(shallow(component).find(InputValue)).toHaveLength(1);
  });

  it("renders with InputValueHelper", () => {
    const component = (
      <RadioInput label="Foo" helper="Bar" input={basicInputObject} />
    );
    expect(shallow(component).find(InputValueHelper)).toHaveLength(1);
  });

  it("renders without InputValueHelper", () => {
    const component = <RadioInput label="Foo" input={basicInputObject} />;
    expect(shallow(component).find(InputValueHelper)).toHaveLength(0);
  });
});
