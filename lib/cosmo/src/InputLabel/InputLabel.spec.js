/* @flow */

import React from "react";
import { render } from "enzyme";
import InputLabel from "./InputLabel";

describe("InputLabel test suite", () => {
  const component = <InputLabel>Label</InputLabel>;
  it("renders the stored snapshot", () => {
    expect(render(component)).toMatchSnapshot();
  });
});
