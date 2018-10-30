export default store => ({
  path: '/page',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Page = require('./Page').default;

      cb(null, Page);
    }, 'page');
  }
});
