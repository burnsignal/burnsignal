import React, { Component, Fragment } from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import { Row, Col } from "reactstrap";
import { GetProposalData } from "../../utils/GraphHelper";
import { GetVoteInfo, GetQuadraticTotals } from "../../utils/VoteHelper";
import { getTransactions } from "../../constants/calls";
import Bar from './charts/bar';
import Spline from './charts/spline';

import "../css/proposal.css";

class Proposal extends Component {
  // Old without QR. Retrieves exisiting proposal data, processes and displays.
  state = { deposits: [], uniqueAddresses: [], graphLoaded: false };

  componentDidMount = async () => {
      await this.processVotes();
  };

  async processVotes(){
    const { name, optionAaddr, optionBaddr } = this.props.proposal;
    // Retrieve porposal deposit data from Graph.
    var proposalData = await GetProposalData(name);

    if(!proposalData.data){
      console.log('MMMhhhh this is weird...')
      return;
    }
    // Process all the deposit info for this proposal - BrightID check.
    var voteInfo = await GetVoteInfo(proposalData);

    // Calculate voting info.
    var proposalQuadraticInfo = await GetQuadraticTotals(voteInfo.voters);

    var noVotes = await getTransactions(optionBaddr, false);
    var yesVotes = await getTransactions(optionAaddr, true);

    this.setState({
      graphLoaded: true,
      yesCount: proposalQuadraticInfo.yesCount,
      noCount: proposalQuadraticInfo.noCount,
      noUniqueAdresses: proposalQuadraticInfo.noUniqueAdresses,
      totalValue: proposalQuadraticInfo.totalValue,
      yesVotes,
      noVotes
    });
  }

  render() {
    const { totalValue, yesVotes, noVotes, noUniqueAdresses, yesCount, noCount } = this.state;
    const { name, optionAaddr, optionBaddr, id } = this.props.proposal;

    return(
     <div className="proposalComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <div className="proposal-title">{name}</div>
            </div>
            <div className="card-body">
              <div className="github-detail">See GitHub for full details:</div>
              <div className="vote-options">
                <button className="btn btn-primary btn-simple">Yes</button>
                <button className="btn btn-primary btn-simple">No</button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">Results</h3>
            </div>
            <div className="card-body">
              {!isNaN(yesCount) && (
                <Bar
                  chartId={`${id.substring(0, 10)}`}
                  yesCount={yesCount}
                  noCount={noCount}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">History</h3>
            </div>
            <div class="card-body">
              {!isNaN(yesVotes) && (
                <Spline
                  chartId={`${id.substring(0, 10)}`}
                  yesVotes={yesVotes}
                  noVotes={noVotes}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
     </div>
    )
  }
}

export default Proposal
