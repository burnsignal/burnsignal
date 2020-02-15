import React, { Fragment, useState, useContext, useEffect } from 'react'
import { Dropdown, DropdownToggle } from "reactstrap"
import { Col, Row } from "reactstrap"

import { createURL } from "../../constants/operatives"
import { PINK_PRIMARY } from "../../constants/palette.js"
import { store } from "../../state"

const QRCode = require('qrcode.react')

function Option(props) {
  const ENS = `${createURL(props.title)}.burnsignal.eth`
  const [ burnAmount, setBurn ] = useState("")

  let { state } = useContext(store)
  let { title } = props

  const handleBurn = (e) => {
    setBurn(e.target.value)
  }

  function Unauthenticated({ option }){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          Vote <span id="pink">{option}</span> by sending any amount of ETH to <br/>
          <a target="_" href='https://etherscan.io'><span id="pink">{option}</span>.{ENS}</a>
          <div className="poll-qr">
            <QRCode value={props.address[option]} />
          </div>
          To ensure that you vote counts, please link your ethereum account
          to your BrightID account at  <a target="_" href="https://ethereum.brightid.org">ethereum.brightid.org</a>
        </div>
      </div>
     )
   }

  function AuthenticatedAndVerified({ option }){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <span className="vote-selection"> How much ETH will you burn to cast your vote? </span>
          <input type="number" autoFocus onChange={handleBurn} value={burnAmount} className="modal-input" placeholder="0.5 ETH"/>
        </div>
        <div class="modal-footer">
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal" onClick={() => makeTransaction(option)}>
            Vote {option}
          </button>
        </div>
      </div>
    )
  }

  function AuthenticatedAndUnverified(){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Please verify your account</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          Before casting your vote, you should verify your Ethereum account using BrightID.
        </div>
        <div class="modal-footer">
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal">
            Verify
          </button>
        </div>
      </div>
     )
  }

  const makeTransaction = async(option) => {
    let { web3 } = state

    props.dismiss()

    const burn = burnAmount % 1 === 0 ?
      web3.utils.toBN(parseFloat(burnAmount)).mul(web3.utils.toBN(1e18)) :
      parseInt(burnAmount*Math.pow(10,18))

    await web3.eth.sendTransaction({
        to: props.address[option],
        from: state.accounts[0],
        value: burn
      })
  }

  const handleInput = (event) => {
    setBurn(event.target.value)
  }
  return (
    <Fragment>
      <div className="modal fade" id="yes" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          { state.web3 && state.verified && (<AuthenticatedAndVerified option="yes" />) }
          { !state.web3 && !state.verified && (< Unauthenticated option="yes"/>) }
          { state.web3 && !state.verified && (<AuthenticatedAndUnverified />) }
        </div>
      </div>
      <div className="modal fade" id="no" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          { state.web3 && state.verified && (<AuthenticatedAndVerified option="no" />) }
          { !state.web3 && !state.verified && (< Unauthenticated option="no"/>) }
          { state.web3 && !state.verified && (<AuthenticatedAndUnverified />) }
        </div>
      </div>
    </Fragment>
  )
}

export default Option
