/* @flow */

import React from "react";
import { render } from "enzyme";
import FormHeader from "./FormHeader";

describe("FormHeader test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormHeader>Hi</FormHeader>;
    expect(render(component)).toMatchSnapshot();
  });
});
