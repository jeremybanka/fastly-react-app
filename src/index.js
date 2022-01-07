// import { Response, createServer } from "miragejs"

import App from "./App"
import { BrowserRouter } from "react-router-dom"
// import { Cache } from "rsrc"
// @ts-ignore
import { IntlProvider } from "cosmo"
import React from "react"
import ReactDOM from "react-dom"
// import { makeServer } from "./mirage"
import { makeServer } from "./server"
import reportWebVitals from "./reportWebVitals"

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  // const serverConfig = generateServerConfig({ environment: "development" })
  // createServer(serverConfig)
  makeServer({ environment: "development" })
}

// @ts-ignore
if (window.Cypress) {
  console.log("Cypress detected, setting up proxy")
  // @ts-ignore
  window.server = makeServer({ environment: "test" })
  // @ts-ignore
  window.server.logging = true

  // @ts-ignore
  window.runCypressMirageFunctions()
}

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale={"en"}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
