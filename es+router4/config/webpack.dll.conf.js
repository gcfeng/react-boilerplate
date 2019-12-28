const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const paths = require('./paths');
const env = require('./env');
const dll = require('./dll');
const pkg = require(paths.appPackageJson);

const NODE_ENV = process.env.NODE_ENV;
const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';

module.exports = {
  mode: isEnvDevelopment ? 'development' : 'production',
  entry: dll,
  output: {
    path: paths.appDll,
    filename: isEnvProduction ? '[name].[chunkhash:8].min.js' : '[name].dll.js',
    library: '[name]'
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  plugins: [
    new WebpackBar({
      name: `🐶 ${pkg.name} dll`
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.DllPlugin({
      name: '[name]', // Should be same with output.library
      path: path.resolve(paths.appDll, '[name].manifest.json')
    })
  ]
};
