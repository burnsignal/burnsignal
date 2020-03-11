import React, { Fragment, useContext, useEffect } from "react";
import {  Switch, Route, HashRouter, withRouter, Link } from 'react-router-dom'
import { Container } from "reactstrap"

import "./assets/libs/black-dashboard/assets/css/black-dashboard-react.css"
import "./assets/libs/black-dashboard/assets/css/nucleo-icons.css"
import "./assets/css/navigation.css"
import "./assets/css/profile.css"
import "./assets/css/poll.css"
import "./assets/css/native.css"

import Navigation from './assets/components/navigation'
import Option from './assets/components/option'

import { getPolls, getETHPrice } from "./constants/calls/GraphQL"
import { getAuthenicated } from "./constants/calls/REST"
import { store } from './state'

import Profile from './routes/profile'
import Poll from './routes/poll'
import Feed from './routes/feed'

function RouteError(){
  return(
    <center>
      <div class="page404">
        <h2> 404 not found </h2>
        <label> Oops, looks like you've made a wrong turn...
        <br /><Link to ="/"> Take me back! </Link></label>
     </div>
    </center>
  )
}

function App(props) {
  let { dispatch, state } = useContext(store)

  useEffect(() => window.scrollTo(0, 0), [ props.location.pathname ])

  useEffect(() => {
    const retrievePolls = async() => {
      var authenicated = await getAuthenicated()
      var price = await getETHPrice()
      var polls = await getPolls()

      dispatch({
        payload: {
          authenicated, polls, price
        },
        type: "INIT"
      })
    }
    retrievePolls()
  }, [])

  return (
    <main>
      <Navigation />
      <Container>
        <Switch>
          <Route path="/poll/:address/:option?" component={Poll} />
          <Route path="/profile/:address" component={Profile} />
          <Route exact path="/" component={Feed} />
          <Route path="/logout" component={Feed} />
          <Route path="/login" component={Feed} />
          <Route path="/create"component={Feed} />
          <Route path="/about" component={Feed}/>
          <Route><RouteError /></Route>
        </Switch>
      </Container>
    </main>
  );
}

export default withRouter(App);
