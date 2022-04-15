/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import Page from "./Page";

describe("Page test suite", () => {
  it("renders with className .Page", () => {
    expect(shallow(<Page />).is(".Page")).toBe(true);
  });

  it("renders the stored snapshot", () => {
    expect(render(<Page />)).toMatchSnapshot();
  });
});
