/* @flow */

import React from "react";
import { render } from "enzyme";
import InputValueHelper from "./InputValueHelper";

describe("InputValueHelper test suite", () => {
  const component = <InputValueHelper>Label</InputValueHelper>;
  it("renders the stored snapshot", () => {
    expect(render(component)).toMatchSnapshot();
  });
});
