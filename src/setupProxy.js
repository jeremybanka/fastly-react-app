const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://dashboard.signalsciences.net",
      changeOrigin: true,
    })
  );
  app.use(
    ["/stats", "/service", "/verify", "/metrics"],
    createProxyMiddleware({
      target: "https://api.fastly.com",
      changeOrigin: true,
      headers: {
        Origin: "https://manage.fastly.com",
      },
    })
  );
};
