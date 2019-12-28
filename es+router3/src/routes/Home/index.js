export default store => ({
  path: '/home',

  getComponent(nextState, cb) {
    import('./HomeContainer').then(Home => cb(null, Home.default));
  }
});
