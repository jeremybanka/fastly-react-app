/* @flow */

import React from "react";
import { render } from "enzyme";
import FormActions from "./FormActions";

describe("FormActions test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormActions>Hi</FormActions>;
    expect(render(component)).toMatchSnapshot();
  });
});
