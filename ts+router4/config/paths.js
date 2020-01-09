const path = require('path');

/**
 * Resolve directory base on project directory
 * @param dir
 */
const resolveApp = dir => {
  return path.resolve(__dirname, '../', dir);
};

module.exports = {
  resolveApp,
  appSrc: resolveApp('src'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appNodeModules: resolveApp('node_modules'),
  appDll: resolveApp('public/dll'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appIndex: resolveApp('src/index.tsx'),
  appHtml: resolveApp('public/index.html'),
  servedPath: '/'
};
