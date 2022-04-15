/* @flow */

import React from "react";
import { render, mount } from "enzyme";
import { InputValue } from "components";
import { ThemeProvider } from "styled-components";
import SwitchInput from "./SwitchInput";

const handleBlur = jest.fn();
const handleChange = jest.fn();
const basicInputObject = {
  name: "colors",
  id: "colors-blue",
  checked: true,
  onChange: handleChange,
  onBlur: handleBlur,
};

describe("SwitchInput test suite", () => {
  it("renders the stored snapshot", () => {
    const component = (
      <ThemeProvider
        theme={{
          colors: {
            grays: new Array(10).fill("#000"),
            indigo: "rgba(0, 0, 0)",
          },
        }}
      >
        <SwitchInput
          label="Blue"
          input={basicInputObject}
          helper="Could ancient greeks see blue?"
        />
      </ThemeProvider>
    );
    expect(render(component)).toMatchSnapshot();
  });

  it("renders with InputValue", () => {
    const component = (
      <ThemeProvider
        theme={{
          colors: {
            grays: new Array(10).fill("#000"),
            indigo: "rgba(0, 0, 0)",
          },
        }}
      >
        <SwitchInput label="Foo" input={basicInputObject} />
      </ThemeProvider>
    );
    expect(mount(component).find(InputValue)).toHaveLength(1);
  });
});
