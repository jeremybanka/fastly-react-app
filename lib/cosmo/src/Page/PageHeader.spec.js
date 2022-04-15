/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import PageHeader from "./PageHeader";

describe("PageHeader test suite", () => {
  it("renders with className .PageHeader", () => {
    expect(shallow(<PageHeader />).is(".PageHeader")).toBe(true);
  });

  it("renders the stored snapshot", () => {
    expect(render(<PageHeader />)).toMatchSnapshot();
  });
});
