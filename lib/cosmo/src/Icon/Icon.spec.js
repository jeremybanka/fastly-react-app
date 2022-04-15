/* @flow */

import React from "react";
import { shallow } from "enzyme";

import Icon from "./Icon";

describe("Icon test suite", () => {
  it("renders with className .Icon", () => {
    const wrapper = shallow(<Icon />);
    expect(wrapper.is(".Icon")).toBe(true);
  });
});
