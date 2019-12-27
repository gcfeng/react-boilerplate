const webpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.base.conf');
const paths = require('./paths');
const env = require('./env');

module.exports = webpackMerge(webpackConfig, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: env.port,
    contentBase: [paths.appBuild, paths.appDll],
    historyApiFallback: true,
    hot: true,
    disableHostCheck: true,
    compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
    stats: {
      assets: false,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false
    }
  }
});
