import React, { Component, Fragment, useContext } from 'react';
import { Route, Link } from 'react-router-dom'

import { store } from '../assets/state'
import Proposal from './poll';

function Feed() {
  let { proposals } = useContext(store)

  return (
    <Fragment>
      {proposals.map((proposal) => (
        <Link to={`/poll/${proposal.id}`}>
          <Proposal key={proposal.id} proposal={proposal}/>
        </Link>
      ))}
    </Fragment>
  )
}

export default Feed
