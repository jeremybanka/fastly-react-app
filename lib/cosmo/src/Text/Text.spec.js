/* @flow */

import React from "react";
import { render } from "enzyme";

import Text from "./Text";

describe("Text test suite", () => {
  // it('renders with className .Text', () => {
  //   const wrapper = shallow(<Text>Hi</Text>)
  //   expect(wrapper.is('.Text')).toBe(true)
  // })

  it("renders the stored snapshot", () => {
    const component = <Text>Hi</Text>;
    expect(render(component)).toMatchSnapshot();
  });
});
