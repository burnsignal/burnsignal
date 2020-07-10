import React, { Fragment, useState, useContext, useEffect } from 'react';
import {  Switch, Route, HashRouter, withRouter, Link } from 'react-router-dom'
import { Container } from 'reactstrap'

import './assets/libs/black-dashboard/assets/css/black-dashboard-react.css'
import './assets/libs/black-dashboard/assets/css/nucleo-icons.css'
import './assets/css/navigation.css'
import './assets/css/profile.css'
import './assets/css/poll.css'
import './assets/css/native.css'

import Navigation from './assets/components/navigation'
import Alert from './assets/components/alert'

import { retrievePolls } from './constants/requests'
import { store } from './state'

import Profile from './routes/profile'
import Error404 from './routes/404'
import Poll from './routes/poll'
import Feed from './routes/feed'

function App(props) {
  let { dispatch, state } = useContext(store)

  useEffect(() => window.scrollTo(0, 0), [ props.location.pathname ])

  useEffect(() => {
    retrievePolls(dispatch)
  }, [ ])

  return (
    <main>
      <Navigation />
      <Container>
        <Switch>
          <Route path='/poll/:address/:option?' component={Poll} />
          <Route path='/profile/:address' component={Profile} />
          <Route exact path='/' component={Feed} />
          <Route path='/logout' component={Feed} />
          <Route path='/login' component={Feed} />
          <Route path='/create'component={Feed} />
          <Route path='/about' component={Feed}/>
          <Route component={Error404} />
        </Switch>
        <Alert />
      </Container>
    </main>
  );
}

export default withRouter(App);
