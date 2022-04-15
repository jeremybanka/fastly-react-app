/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import PageTitle from "./PageTitle";

describe("PageTitle test suite", () => {
  it("renders with className .PageTitle", () => {
    expect(shallow(<PageTitle>Page Title</PageTitle>).is(".PageTitle")).toBe(
      true
    );
  });

  it("renders the stored snapshot", () => {
    expect(render(<PageTitle>Page Title</PageTitle>)).toMatchSnapshot();
  });
});
