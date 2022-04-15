/* @flow */

import React from "react";
import { render } from "enzyme";
import FormSection from "./FormSection";

describe("FormSection test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormSection>Hi</FormSection>;
    expect(render(component)).toMatchSnapshot();
  });
});
