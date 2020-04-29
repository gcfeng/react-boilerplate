const portfinderSync = require('portfinder-sync');
const { BUILD_ENV, NODE_ENV } = process.env;

let envName = BUILD_ENV || NODE_ENV;
const isEnvDevelopment = envName === 'development';
// const isEnvProduction = envName === 'production';

// Specific webpack config
const buildVars = {
  sourceMap: isEnvDevelopment ? 'cheap-module-source-map' : false,
  // https://github.com/chimurai/http-proxy-middleware
  proxy: {},
  port: 8080
};

// Environment variables which will be passed to webpack.DefinePlugin
const buildEnvs = {
  NODE_ENV: envName === 'development' ? 'development' : 'production'
};

const usefulPort = portfinderSync.getPort(buildVars.port);
buildVars.port = usefulPort;

module.exports = {
  ...buildVars,
  stringified: {
    'process.env': Object.keys(buildEnvs).reduce((env, key) => {
      env[key] = JSON.stringify(buildEnvs[key]);
      return env;
    }, {})
  }
};
