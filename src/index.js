import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'

import { StateProvider } from './state'
import Root from './routes/root';

ReactDOM.render(
  <StateProvider>
    <HashRouter>
      <Fragment>
        <Root />
      </Fragment>
    </HashRouter>
  </StateProvider>,
  document.getElementById('root')
);

serviceWorker.unregister()
