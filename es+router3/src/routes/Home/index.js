export default store => ({
  path: '/home',

  getComponent(nextState, cb) {
    import('./HomeContainer').then(Page => cb(null, Page.default));
  }
});
