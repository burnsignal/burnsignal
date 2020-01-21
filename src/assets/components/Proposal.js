import React, { Component } from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import { Row, Col } from "reactstrap";
import { GetProposalData } from "../utils/GraphHelper";
import { GetVoteInfo, GetQuadraticTotals } from "../utils/VoteHelper";

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

    await this.GetQuadraticTotals(voters);

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
      <div>
        <h3>{this.props.proposal.name}</h3>
        <Row>
          <Col className="col-sm">
            <p>ID: {this.props.proposal.id}</p>
            <p>Issuer: {this.props.proposal.issuer}</p>
            <p>Deadline: {this.props.proposal.deadline}</p>
            <p>Name: {this.props.proposal.name}</p>
            <p>Data: {this.props.proposal.data}</p>
            <p>optionBaddr: {this.props.proposal.optionBaddr}</p>
            <p>optionAaddr: {this.props.proposal.optionAaddr}</p>
            <br/>
            <p>Yes Votes: {this.state.yesCount}</p>
            <p>No Votes: {this.state.noCount}</p>
            <p>uniqueAddresses: {noUniqueAdresses}</p>
          </Col>
          <Col className="col-sm">
            { chart }
          </Col>
        </Row>
        <hr/>
      </div>
    )
  }
}

export default Proposal
