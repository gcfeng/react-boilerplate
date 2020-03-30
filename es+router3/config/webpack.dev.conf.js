const webpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.base.conf');
const paths = require('./paths');
const env = require('./env');

module.exports = webpackMerge(webpackConfig, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: env.port,
    contentBase: [paths.appBuild, paths.appDll, paths.appPublic],
    historyApiFallback: true,
    proxy: env.proxy,
    hot: true,
    disableHostCheck: true,
    compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
    logLevel: 'silent',
    clientLogLevel: 'silent'
  }
});
