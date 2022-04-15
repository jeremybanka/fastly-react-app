/* @flow */

import React from "react";
import { render } from "enzyme";
import Form from "./Form";

describe("Form test suite", () => {
  it("renders the stored snapshot", () => {
    const handleSubmit = jest.fn();
    const component = <Form onSubmit={handleSubmit}>Hi</Form>;
    expect(render(component)).toMatchSnapshot();
  });
});
