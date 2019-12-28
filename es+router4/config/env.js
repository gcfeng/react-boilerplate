const { BUILD_ENV, NODE_ENV } = process.env;

let envName = BUILD_ENV || NODE_ENV;
const isEnvDevelopment = envName === 'development';
// const isEnvProduction = envName === 'production';

// Specific webpack config
const buildEnvs = {
  sourceMap: isEnvDevelopment ? 'cheap-module-source-map' : false,
  // https://github.com/chimurai/http-proxy-middleware
  proxy: {},
  port: 8080
};

// Environment variables which will be passed to webpack.DefinePlugin
const definedEnvs = {
  NODE_ENV: envName === 'development' ? 'development' : 'production'
};

module.exports = {
  ...buildEnvs,
  stringified: {
    'process.env': Object.keys(definedEnvs).reduce((env, key) => {
      env[key] = JSON.stringify(definedEnvs[key]);
      return env;
    }, {})
  }
};
