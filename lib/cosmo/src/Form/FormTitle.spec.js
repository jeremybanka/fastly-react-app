/* @flow */

import React from "react";
import { render } from "enzyme";
import FormTitle from "./FormTitle";

describe("FormTitle test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormTitle>My Title</FormTitle>;
    expect(render(component)).toMatchSnapshot();
  });
});
