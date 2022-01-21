import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { IntlProvider } from "cosmo"
import React from "react"
import { makeServer } from "./mirage"
import { render } from "react-dom"
import reportWebVitals from "./reportWebVitals"

if (process.env.REACT_APP_ENVIRONMENT === `development`) {
  const server = makeServer({ environment: `development` })
  server.logging = true
}

if (window.Cypress) {
  console.log(`Cypress detected, setting up proxy`)
  window.server = makeServer({ environment: `test` })
  window.server.logging = true

  window.runCypressMirageFunctions()
}

render(
  <React.StrictMode>
    <IntlProvider locale={`en`}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById(`root`)
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
