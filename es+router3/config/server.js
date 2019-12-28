const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
const compression = require('compression');
const env = require('./env');
const paths = require('./paths');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || env.port || 8080;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxy = env.proxy || {};

const app = express();

// proxy api requests
Object.keys(proxy).forEach(function(context) {
  let options = proxy[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());
app.use(compression());
app.use(express.static(paths.appBuild));

// Start your app.
app.listen(port);
console.log(`Project is running at http://0.0.0.0:${port}`);
