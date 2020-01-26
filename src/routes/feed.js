import React, { Fragment, useContext, useEffect } from 'react';
import { Route, Link } from 'react-router-dom'

import { store } from '../assets/state'
import Proposal from './poll';

function Feed() {
  let { state } = useContext(store)

  return (
    <Fragment>
      {state.proposals.map((proposal) => (
        <Proposal key={proposal.id} proposal={proposal}/>
      ))}
    </Fragment>
  )
}

export default Feed
