import App from './App';
import Home from './Home';

export default store => ({
  path: '/',
  component: App,
  indexRoute: {
    onEnter(nextState, replace) {
      replace('/home');
    }
  },
  childRoutes: [Home(store)]
});
