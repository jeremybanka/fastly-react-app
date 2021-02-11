/* @flow */

import React from "react";
import { render } from "enzyme";
import InputValue from "./InputValue";

describe("InputValue test suite", () => {
  const component = <InputValue>Label</InputValue>;
  it("renders the stored snapshot", () => {
    expect(render(component)).toMatchSnapshot();
  });
});
