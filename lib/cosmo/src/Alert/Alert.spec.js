/* @flow */

import React from "react";
import { render } from "enzyme";

import Alert from "./Alert";

describe("Alert test suite", () => {
  it("renders the stored snapshot", () => {
    expect(render(<Alert purpose="info" />)).toMatchSnapshot();
  });
});
