import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, history } from './store';
import { routes } from './routes';
import { ConnectedRouter } from 'connected-react-router';
import './assets/styles/style';
import 'materialize-css/dist/css/materialize.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// render the main component
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);