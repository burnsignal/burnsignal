import React, { Component } from 'react';

class Deposit extends Component {
  /*
  Default to display Deposit info. A deposit consists of:
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
      <div>
        <p>ID: {this.props.deposit.id}</p>
        <p>SenderAddr: {this.props.deposit.SenderAddr}</p>
        <p>ContriValue: {this.props.deposit.ContriValue}</p>
        <p>PropName: {this.props.deposit.PropName}</p>
        <p>Choice: {this.props.deposit.Choice}</p>
        <hr/>
      </div>
    )

  }
}

export default Deposit
