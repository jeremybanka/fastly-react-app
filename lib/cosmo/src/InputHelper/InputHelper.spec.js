/* @flow */

import React from "react";
import { render } from "enzyme";
import InputHelper from "./InputHelper";

describe("InputHelper test suite", () => {
  const component = <InputHelper>Helper</InputHelper>;
  it("renders the stored snapshot", () => {
    expect(render(component)).toMatchSnapshot();
  });
});
