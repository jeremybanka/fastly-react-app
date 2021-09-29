import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

// This is an example test that just snapshots the <App />.
// Expectation is that this test would be removed in favour of more discreet
// component tests.

test("example snapshot test for <App />", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
