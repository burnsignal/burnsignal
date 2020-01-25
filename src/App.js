import React, { Fragment, useContext, useEffect } from "react";
import {  Route } from 'react-router-dom'
import { Container } from "reactstrap";

import "./assets/libs/black-dashboard/assets/css/black-dashboard-react.css";
import "./assets/libs/black-dashboard/assets/css/nucleo-icons.css";
import "./assets/css/navigation.css";

import Navigation from './assets/components/navigation';

import { getProposals } from "./utils/GraphHelper"
import { store } from './assets/state'

import Poll from './routes/poll';
import Feed from './routes/feed';
import New from './routes/new';

function App() {
  let { dispatch, state } = useContext(store)

  console.log(state);

  useEffect(async() => {
    let proposalStream = await getProposals()
    dispatch({
      payload: proposalStream,
      type: "PROPOSAL"
    })
  }, [ ])

  return (
    <main>
      <Container>
        <Navigation>
          <Route path="/poll/:address" component={Poll} />
          <Route exact path="/" component={Feed} />
          <Route path="/new" component={New} />
        </Navigation>
      </Container>
    </main>
  );
}

export default App;
