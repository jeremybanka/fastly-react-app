/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import PageBody from "./PageBody";

describe("PageBody test suite", () => {
  it("renders with className .PageBody", () => {
    expect(shallow(<PageBody />).is(".PageBody")).toBe(true);
  });

  it("renders the stored snapshot", () => {
    expect(render(<PageBody />)).toMatchSnapshot();
  });
});
