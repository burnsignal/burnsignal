import React, { Component, Fragment } from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import { Row, Col } from "reactstrap";
import { GetProposalData } from "../../utils/GraphHelper";
import { GetVoteInfo, GetQuadraticTotals } from "../../utils/VoteHelper";

import "../css/proposal.css";

class Proposal extends Component {
  // Old without QR. Retrieves exisiting proposal data, processes and displays.
  state = { deposits: [], uniqueAddresses: [], graphLoaded: false };

  componentDidMount = async () => {
      await this.processVotes();
  };

  async processVotes(){
    // Retrieve porposal deposit data from Graph.
    var proposalData = await GetProposalData(this.props.proposal.name);

    if(!proposalData.data){
      console.log('MMMhhhh this is weird...')
      return;
    }
    // Process all the deposit info for this proposal - BrightID check.
    var voteInfo = await GetVoteInfo(proposalData);

    // Calculate voting info.
    var proposalQuadraticInfo = await GetQuadraticTotals(voteInfo.voters);

    this.setState({
      graphLoaded: true,
      yesCount: proposalQuadraticInfo.yesCount,
      noCount: proposalQuadraticInfo.noCount,
      noUniqueAdresses: proposalQuadraticInfo.noUniqueAdresses,
      totalValue: proposalQuadraticInfo.totalValue
    });
  }

  render() {
    const noUniqueAdresses = this.state.uniqueAddresses.length;
    const { name, optionAaddr, optionBaddr } = this.props.proposal;

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
              <h5 class="card-category">Results</h5>
              <h3 class="card-title">
              <i class="tim-icons icon-bell-55 text-primary"></i>
              {this.state.totalValue} Wei</h3>
            </div>
            <div className="card-body">
              <div class="chart-area">
                <canvas id="CountryChart"></canvas>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h5 class="card-category">Total Shipments</h5>
              <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
            </div>
            <div class="card-body">
              <div class="chart-area">
                <canvas id="chartLinePurple"></canvas>
              </div>
            </div>
          </div>
        </Col>
      </Row>
     </div>
    )
  }
}

export default Proposal
