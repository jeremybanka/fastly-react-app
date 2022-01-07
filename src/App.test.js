import App from "./App"
import React from "react"
import { mount } from "@cypress/react"

it("renders learn react link", () => {
  mount(<App />)
  cy.get("#/tls-configurations").contains("TLS")
})
