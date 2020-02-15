import React, { Fragment, useContext, useEffect } from "react";
import {  Switch, Route, HashRouter, withRouter } from 'react-router-dom'
import { Container } from "reactstrap"

import "./assets/libs/black-dashboard/assets/css/black-dashboard-react.css"
import "./assets/libs/black-dashboard/assets/css/nucleo-icons.css"
import "./assets/css/navigation.css"

import Navigation from './assets/components/navigation'
import Option from './assets/components/option'

import { getPolls } from "./constants/calls/GraphQL"
import { store } from './state'

import Profile from './routes/profile'
import Poll from './routes/poll'
import Feed from './routes/feed'

function App(props) {
  let { dispatch, state } = useContext(store)

  useEffect(() => window.scrollTo(0, 0), [ props.location.pathname ])

  useEffect(() => {
    const retrievePolls = async() => {
      var pollStream = await getPolls()
      dispatch({
        payload: pollStream,
        type: "POLL"
      })
    }
    retrievePolls()
  }, [])

  return (
    <main>
      <Container>
        <Navigation />
        <Switch>
          <Route path="/profile/:address" component={Profile} />
          <Route path="/poll/:address/:option?" component={Poll} />
          <Route path="/about" render={() => {
            console.log(document.getElementById('create-modal'))
             if(document.getElementById('create-modal')){
               document.getElementById('create-modal').click()
             }

           }}/>
          <Route path="/create" render={() => { window.jQuery('#create').modal('show')}}/>
          <Route exact path="/" component={Feed} />
          <Route>{'404'}</Route>
        </Switch>
      </Container>
    </main>
  );
}

export default withRouter(App);
