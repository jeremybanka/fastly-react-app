// This is a simple server to serve a built website, using proxy for api calls
// yarn build && yarn serve

const express = require("express");
const path = require("path");
const app = express();

// Use the same proxy settings used in development mode
require("./src/setupProxy")(app);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
