import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from "reactstrap";

import Proposal from './Proposal.js';

class Proposals extends Component {

  render() {
    return (
      <Fragment>
        {this.props.proposals.map((proposal) => (
          <Proposal key={proposal.id} proposal={proposal}/>
        ))}
      </Fragment>
    )
  }
}

export default Proposals
