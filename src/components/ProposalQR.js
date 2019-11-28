import React, { Component } from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import { Row, Col } from "reactstrap";
import { GetProposalData } from "../utils/GraphHelper";
import { GetVoteInfo, GetQuadraticTotals } from "../utils/VoteHelper";
var QRCode = require('qrcode.react');

class Proposal extends Component {

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

    var noUniqueAdresses = this.state.noUniqueAdresses;

    var quickStyle = {
      textAlign: 'center'
    };

    return(
      <div>

        <Row>
          <Col className="col-sm">
            <h3 style={quickStyle}>Yes</h3>
            <p>Yes Votes: {this.state.yesCount}</p>
            <p>To vote YES to this proposal send any amount of ETH to:</p>
            <div>
              <div style={{textAlign: 'center', backgroundColor: 'white'}}>
                <QRCode value={this.props.proposal.optionAaddr} style={{paddingTop: '10px'}}/>
              </div>
            </div>
            <p>{this.props.proposal.optionAaddr}</p>
          </Col>
          <Col className="col-sm">
            <h2 style={quickStyle}>{this.props.proposal.name}</h2>
            <p>Total Value Burned (wei): {this.state.totalValue}</p>
            <p>Unique Voters: {noUniqueAdresses}</p>
            { chart }
          </Col>
          <Col className="col-sm">
            <h3 style={quickStyle}>No</h3>
            <p>No Votes: {this.state.noCount}</p>
            <p>To vote NO to this proposal send any amount of ETH to:</p>
            <div>
              <div style={{textAlign: 'center', backgroundColor: 'white'}}>
                <QRCode value={this.props.proposal.optionBaddr} style={{paddingTop: '10px'}}/>
              </div>
            </div>
            <p>{this.props.proposal.optionBaddr}</p>
          </Col>
        </Row>
        <hr/>
      </div>
    )

  }
}

export default Proposal
