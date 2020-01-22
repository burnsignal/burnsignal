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
    // Process all the deposit info.
    var voteInfo = await GetVoteInfo(proposalData);

    this.setState({
      totalValue: voteInfo.totalValue,
      voters: voteInfo.voters
    });

    await this.GetQuadraticTotals(voteInfo.voters);

    console.log('graph() OUT')
  }

  render() {

    let chart;
    if(this.state.graphLoaded){
      chart =  <ReactMinimalPieChart
                    animate={false}
                    animationDuration={500}
                    animationEasing="ease-out"
                    cx={50}
                    cy={50}
                    data={[
                      {
                        color: '#E38627',
                        title: 'Yes',
                        value: this.state.yesCount
                      },
                      {
                        color: '#C13C37',
                        title: 'Two',
                        value: this.state.noCount
                      }
                    ]}
                    label
                    labelPosition={50}
                    labelStyle={{
                      fill: '#121212',
                      fontFamily: 'sans-serif',
                      fontSize: '5px'
                    }}
                    lengthAngle={360}
                    lineWidth={100}
                    onClick={undefined}
                    onMouseOut={undefined}
                    onMouseOver={undefined}
                    paddingAngle={0}
                    radius={50}
                    ratio={1}
                    rounded={false}
                    startAngle={0}
                    style={{
                      height: '300px'
                    }}
                  />

    }

    var noUniqueAdresses = this.state.uniqueAddresses.length;

    return(
     <div className="proposalComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <div className="title proposal">Should Ethereum implement EIR-1057 ProgPow?</div>
            </div>
            <div className="card-body">
              <div className="github-detail">See GitHub for full details:</div>
              <div className='buttons'>
                <button className="btn btn-primary btn-simple vote-yes">Yes</button>
                <button className="btn btn-primary btn-simple vote-no">No</button>
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
              <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
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
