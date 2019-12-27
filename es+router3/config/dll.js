/**
 * Config for Webpack DLL Plugin
 */

module.exports = {
  // The DLL manifest:
  // [fileName]: [deps]
  react: ['react', 'react-dom', 'react-redux', 'react-router', 'prop-types']
};
