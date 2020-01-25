import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'

import { StateProvider } from './assets/state'
import App from './App';


ReactDOM.render(
  <StateProvider>
    <HashRouter basename='/'>
      <Fragment>
        <App />
      </Fragment>
    </HashRouter>
  </StateProvider>,
  document.getElementById('root')
);

serviceWorker.unregister()
