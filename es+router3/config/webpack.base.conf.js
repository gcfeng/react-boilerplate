const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const ProgressBar = require('./plugins/progressBar');
const env = require('./env');
const paths = require('./paths');
const dll = require('./dll');
const pkg = require(paths.appPackageJson);

const NODE_ENV = process.env.NODE_ENV;
const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';

// style files regexes
const cssRegex = /.\.css$/;
const cssModuleRegex = /.\.module\.css$/;
const lessRegex = /.\.less$/;
const lessModuleRegex = /.\.module\.less$/;

// Get style loaders
// "postcss" loader applies autoprefixer to our CSS
// "css" loader resolve paths in CSS and adds assets as dependencies
// "style" loader turns CSS into JS modules that inject <style> tags
const getStyleLoaders = (cssOptions, preProcessors) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize()
        ]
      }
    }
  ].filter(Boolean);
  if (preProcessors) {
    if (!Array.isArray(preProcessors)) {
      preProcessors = [preProcessors];
    }
    preProcessors.forEach(processor => {
      if (typeof preProcessors === 'string') {
        loaders.push({ loader: processor });
      } else if (Array.isArray(preProcessors)) {
        loaders.push({ loader: processor[0], options: processor[1] });
      }
    });
  }
  return loaders;
};

module.exports = {
  mode: isEnvDevelopment ? 'development' : 'production',
  // Stop compilation early in production
  bail: isEnvProduction,
  entry: [paths.appIndex],
  devtool: env.sourceMap,
  output: {
    path: paths.appBuild,
    filename: isEnvDevelopment ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isEnvDevelopment ? '[name].chunk.js' : '[name].[contenthash:8].js',
    publicPath: paths.servedPath,
    // Prevents conflicts when multiple Webpack runtimes (from different apps)
    // are used on the same page.
    jsonpFunction: `webpackJsonp${pkg.name}`,
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: 'this'
  },
  optimization: {
    minimize: !isEnvDevelopment,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        sourceMap: false
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardDuplicates: true
        }
      })
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: false
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    }
  },
  resolve: {
    // https://github.com/babel/babel/issues/10036
    modules: [paths.appSrc, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: paths.appSrc
    }
  },
  module: {
    // Makes missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        include: paths.appSrc,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
              resolvePluginsRelativeTo: __dirname
            }
          }
        ]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]'
            }
          },
          // Process application JS with Babel.
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: paths.appSrc,
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              compact: isEnvProduction,
            }
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|jsx)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]
              ],
              cacheDirectory: true
            }
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use MiniCSSExtractPlugin to extract that CSS
          // to a file, but in development "style" loader enables hot editing
          // of CSS.
          // By default we support CSS Modules with the extension .module.css
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true
          },
          // Add support for CSS Modules
          // using the extension .module.css
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false,
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              },
              localsConvention: 'camelCase'
            })
          },
          // Less support
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false
              },
              [[require.resolve('less-loader'), { javascriptEnabled: true }]]
            )
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false,
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]'
                },
                localsConvention: 'camelCase'
              },
              [[require.resolve('less-loader'), { javascriptEnabled: true }]]
            )
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]'
            }
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `dist` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: '[name].[hash:8].[ext]'
            }
          }
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }
    ]
  },
  target: 'web',
  plugins: [
    new ProgressBar({
      name: pkg.name,
      devServer: isEnvDevelopment
    }),
    // Clean dist
    !isEnvDevelopment && new CleanWebpackPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml
        },
        !isEnvDevelopment
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    ),
    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    // https://github.com/facebook/create-react-app/issues/5358
    isEnvProduction && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates (currently CSS only):
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css'
      }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Copy public files
    isEnvProduction &&
      new CopyPlugin([
        {
          context: paths.appPublic,
          from: '**/!(index.html)',
          to: paths.appBuild,
          ignore: ['.*', 'dll/*']
        },
        {
          context: paths.appDll,
          from: '*.min.js',
          to: paths.appBuild
        }
      ]),
    // Inject dll to html
    new HtmlWebpackTagsPlugin({
      append: false,
      tags: [
        isEnvDevelopment
          ? { path: '', glob: '*.dll.js', globPath: paths.appDll }
          : { path: '', glob: '*.min.js', globPath: paths.appDll }
      ]
    })
  ]
    .concat(
      // Dll
      Object.keys(dll).map(
        dllName =>
          new webpack.DllReferencePlugin({
            manifest: require(path.resolve(paths.appDll, `${dllName}.manifest.json`))
          })
      )
    )
    .filter(Boolean),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
