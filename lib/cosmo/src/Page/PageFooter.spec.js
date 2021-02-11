/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import PageFooter from "./PageFooter";

describe("PageFooter test suite", () => {
  it("renders with className .PageFooter", () => {
    expect(shallow(<PageFooter />).is(".PageFooter")).toBe(true);
  });

  it("renders the stored snapshot", () => {
    expect(render(<PageFooter />)).toMatchSnapshot();
  });
});
