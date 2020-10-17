import React, { useState, useEffect, useContext } from 'react';

import { store } from '../../state'

export default function Alert() {
  const [ component, setComponent ] = useState(<span />)

  let { state } = useContext(store)

  function Success(){
    return (
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <h4 class="alert-heading"> Confirmation </h4>
        <hr />
        Transaction {state.receipt.transactionHash} has successfully confirmed, <a href="#" class="alert-link">see more</a>.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }

  function Revert(){
    return(
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <h4 class="alert-heading"> Error </h4>
        <hr />
         Transaction {state.receipt.transactionHash} has failed, <a href="#" class="alert-link">see more</a>.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }

  function Reject(){
    return(
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <h4 class="alert-heading"> Rejected </h4>
        <hr />
         Transaction was rejected by provider.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }

  useEffect(() => {
    let { receipt } = state

    if(receipt.status == 2) setComponent(<Reject />)
    else if(receipt.status == 1) setComponent(<Success />)
    else if(receipt.status == 0) setComponent(<Revert />)

    const alert = setTimeout(() => {
      let targetComponent = document.getElementsByClassName('alert')[0]

      if(targetComponent != undefined){
        setComponent(<span />)
      }
    }, 10000)
    return () => clearTimeout(alert)
  }, [ state.receipt ])

  useEffect(() => {
  }, [ component ])

  return (
    <div class="alert-modal">
      {component}
    </div>
  )
}
