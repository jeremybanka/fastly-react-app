/* @flow */

import React from "react";
import { render } from "enzyme";
import Card from "./Card";

describe("Card test suite", () => {
  const card = (
    <Card>
      <Card.Header>
        <Card.Title>Queen of hearts</Card.Title>
        <Card.Subtitle>Not a bad draw</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        Face cards tend to diverge from the normal appearance of cards with a
        value between 2 and 10
      </Card.Body>
    </Card>
  );
  it("renders the stored snapshot", () => {
    expect(render(card)).toMatchSnapshot();
  });
});
