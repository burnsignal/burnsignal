import React, { Component } from 'react';
import Proposal from './ProposalQR.js';

class Proposals extends Component {

  render() {

    const proposals = this.props.proposals.map(proposal => {
      return <Proposal key={proposal.id} proposal={proposal}/>
    })

    return (
      <div>
        <h2>Proposals</h2>
        {proposals}

      </div>
    )
  }
}

export default Proposals
