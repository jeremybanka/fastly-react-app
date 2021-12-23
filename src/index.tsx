import App from "./App"
import { BrowserRouter } from "react-router-dom"
// import { Cache } from "rsrc"
// @ts-ignore
import { IntlProvider } from "cosmo"
import React from "react"
import ReactDOM from "react-dom"
import { makeServer } from "./mirage"
import reportWebVitals from "./reportWebVitals"

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  makeServer({ environment: "development" })
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
