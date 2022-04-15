/* @flow */

import React from "react";
import { shallow, render } from "enzyme";

import FormattedBytes from "./FormattedBytes";

describe("FormattedBytes test suite", () => {
  it("renders with className .FormattedBytes", () => {
    const wrapper = shallow(<FormattedBytes value={234523} />);
    expect(wrapper.is(".FormattedBytes")).toBe(true);
  });

  it("correctly handles 0", () => {
    const wrapper = shallow(<FormattedBytes value={0} />);
    expect(wrapper.text()).toBe("0B");
  });

  it("correctly handles negative inputs", () => {
    const wrapper = shallow(<FormattedBytes value={-5} />);
    expect(wrapper.text()).toBe("0B");
  });

  it("correctly handles < 1KB values", () => {
    const wrapper = shallow(<FormattedBytes value={1023} />);
    expect(wrapper.text()).toBe("1023B");
  });

  it("correctly handles KB values", () => {
    const wrapper = shallow(<FormattedBytes value={1024 + 102} />);
    expect(wrapper.text()).toBe("1.1KB");
  });

  it("correctly handles MB values", () => {
    const wrapper = shallow(<FormattedBytes value={1024 ** 2 + 1024 * 100} />);
    expect(wrapper.text()).toBe("1.1MB");
  });

  it("correctly handles unreasonably large inputs", () => {
    const wrapper = shallow(<FormattedBytes value={1024 ** 20} />);
    expect(wrapper.text()).not.toContain("undefined");
  });

  it("renders the stored snapshot", () => {
    const component = <FormattedBytes value={67293902} />;
    expect(render(component)).toMatchSnapshot();
  });
});
