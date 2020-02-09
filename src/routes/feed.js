import React, { Fragment, useContext, useEffect } from 'react';
import { Route, Link } from 'react-router-dom'

import { store } from '../state'
import Proposal from './poll';

function Feed() {
  let { state } = useContext(store)

  return (
    <Fragment>
      {Object.keys(state.polls).map((id, index) => (
        <Link to={`/poll/${id}`}>
          <Proposal key={id} id={id}/>
        </Link>
      ))}
    </Fragment>
  )
}

export default Feed
