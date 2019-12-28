import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './routes/App';

const mountNode = document.getElementById('app');
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    mountNode
  );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(['./routes/App'], () => {
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(mountNode);
      render();
    });
  });
}

render();
