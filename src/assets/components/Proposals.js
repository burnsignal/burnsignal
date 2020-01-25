import React, { Component, Fragment } from 'react';
import { Route, Link } from 'react-router-dom'

import Proposal from './Proposal.js';

class Proposals extends Component {

  render() {
    return (
      <Fragment>
        {this.props.proposals.map((proposal) => (
          <Link to={`/poll/${proposal.id}`}>
            <Proposal key={proposal.id} proposal={proposal}/>
          </Link>
        ))}
      </Fragment>
    )
  }
}

export default Proposals
