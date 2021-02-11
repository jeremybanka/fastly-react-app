/* @flow */

import React from "react";
import { render } from "enzyme";
import FormBody from "./FormBody";

describe("FormBody test suite", () => {
  it("renders the stored snapshot", () => {
    const component = <FormBody>Hi</FormBody>;
    expect(render(component)).toMatchSnapshot();
  });
});
