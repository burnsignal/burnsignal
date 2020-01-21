import React, { Component } from 'react';

class Deposit extends Component {

  /*
  anonymousDeposits(first: 5) {
    id
    SenderAddr
    ContriValue
    PropName
    Choice
  }
  */
  render() {
    return(
      <div className="sidebar">

        <div className="sidebar-wrapper">

          <ul className="nav">
            <li className="active ">
              <a href={'/'}>
                <i className="tim-icons icon-chart-pie-36"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li>
              <a href={'/#/newVote'}>
                <i className="tim-icons icon-bulb-63"></i>
                <p>New Proposal</p>
              </a>
            </li>

          </ul>
        </div>
      </div>
    )

  }
}

export default Deposit
