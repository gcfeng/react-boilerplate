import App from './App';
import Home from './Home';
import About from './About';

export default store => ({
  path: '/',
  component: App,
  indexRoute: {
    onEnter(nextState, replace) {
      replace('/home');
    }
  },
  childRoutes: [
    Home(store),
    About(store),
  ]
});
