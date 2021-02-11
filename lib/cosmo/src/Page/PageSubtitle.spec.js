/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import PageSubtitle from "./PageSubtitle";

describe("PageSubtitle test suite", () => {
  it("renders with className .PageSubtitle", () => {
    expect(
      shallow(<PageSubtitle>My Subtitle</PageSubtitle>).is(".PageSubtitle")
    ).toBe(true);
  });

  it("renders the stored snapshot", () => {
    expect(render(<PageSubtitle>My Subtitle</PageSubtitle>)).toMatchSnapshot();
  });
});
