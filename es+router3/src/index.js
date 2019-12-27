import 'react-hot-loader';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import store from './store';
import createRoutes from './routes';

const mountNode = document.getElementById('app');
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={createRoutes(store)} />
    </Provider>,
    mountNode
  );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(['./routes/index'], () => {
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(mountNode);
      render();
    });
  });
}

render();
