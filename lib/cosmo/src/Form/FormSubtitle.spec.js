/* @flow */

import React from "react";
import { render } from "enzyme";
import FormSubtitle from "./FormSubtitle";

describe("FormSubtitle test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormSubtitle>My Subtitle</FormSubtitle>;
    expect(render(component)).toMatchSnapshot();
  });
});
