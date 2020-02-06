import React, { Fragment, useContext, useEffect } from 'react';
import { Route, Link } from 'react-router-dom'

import { store } from '../state'
import Proposal from './poll';

function Feed() {
  let { state } = useContext(store)

  return (
    <Fragment>
      {Object.keys(state.polls).map((proposalId, index) => (
        <Link to={`/poll/${proposalId}`}>
          <Proposal key={proposalId} id={proposalId}/>
        </Link>
      ))}
    </Fragment>
  )
}

export default Feed
