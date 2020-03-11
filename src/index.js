import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'

import { StateProvider } from './state'
import App from './App';

ReactDOM.render(
  <StateProvider>
    <HashRouter>
      <Fragment>
        <App />
      </Fragment>
    </HashRouter>
  </StateProvider>,
  document.getElementById('root')
);

serviceWorker.unregister()
