/* @flow */

import React from "react";
import { render } from "enzyme";

import Tab from "./Tab";

describe("Tab test suite", () => {
  it("renders the stored snapshot", () => {
    const component = (
      <Tab active href="#asdf">
        Hi
      </Tab>
    );
    expect(render(component)).toMatchSnapshot();
  });
});
