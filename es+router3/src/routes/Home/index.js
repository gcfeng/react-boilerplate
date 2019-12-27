export default store => ({
  path: '/home',

  getComponent(nextState, cb) {
    import('./containers/Home').then(Home => cb(null, Home.default));
  }
});
