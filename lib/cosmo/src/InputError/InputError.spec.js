/* @flow */

import React from "react";
import { render } from "enzyme";
import InputError from "./InputError";

describe("InputError test suite", () => {
  const component = <InputError>Error</InputError>;
  it("renders the stored snapshot", () => {
    expect(render(component)).toMatchSnapshot();
  });
});
