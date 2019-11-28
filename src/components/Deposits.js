import React, { Component } from 'react';
import Deposit from './Deposit';

class Deposits extends Component {
  // Default to display all deposits passed as prop.
  render() {

    const deposits = this.props.deposits.map(deposit => {
      return <Deposit key={deposit.id} deposit={deposit}/>
    })

    return (
      <div>
        <h4>{this.props.name} Deposits</h4>
        {deposits}
      </div>
    )
  }
}

export default Deposits
