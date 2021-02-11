/* @flow */

import React from "react";
import { render, shallow } from "enzyme";
import { InputLabel, InputHelper, InputError } from "components";
import TextInput from "./TextInput";

const handleBlur = jest.fn();
const handleChange = jest.fn();
const basicInputObject = {
  name: "email",
  id: "email",
  placeholder: "you@somewhere.com",
  value: "me@here.com", // props.form.values.someName,
  minLength: 3,
  maxLength: 15,
  onChange: handleChange,
  onBlur: handleBlur,
};

describe("TextInput test suite", () => {
  it("renders the stored snapshot", () => {
    const component = (
      <TextInput
        label="Email"
        input={basicInputObject}
        helper="You'll use this to sign in"
        error="Please use a standard email format"
      />
    );
    expect(render(component)).toMatchSnapshot();
  });

  it("renders with InputLabel", () => {
    const component = <TextInput label="Foo" input={basicInputObject} />;
    expect(shallow(component).find(InputLabel)).toHaveLength(1);
  });

  // it('renders without "(optional)" label text', () => {});

  // it('renders with "(optional)" label text', () => {});

  // it("renders character count", () => {});

  it("renders with InputHelper", () => {
    const component = <TextInput helper="Bar" input={basicInputObject} />;
    expect(shallow(component).find(InputHelper)).toHaveLength(1);
  });

  it("renders with InputError", () => {
    const component = <TextInput error="Foo" input={basicInputObject} />;
    expect(shallow(component).find(InputError)).toHaveLength(1);
  });

  it("renders without InputLabel, InputHelper, or InputError", () => {
    const component = <TextInput input={basicInputObject} />;
    expect(shallow(component).find(InputLabel)).toHaveLength(0);
    expect(shallow(component).find(InputHelper)).toHaveLength(0);
    expect(shallow(component).find(InputError)).toHaveLength(0);
  });
});
