export default store => ({
  path: '/about',

  getComponent(nextState, cb) {
    import('./About').then(Page => cb(null, Page.default));
  }
});
