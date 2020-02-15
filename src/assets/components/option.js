import React, { Fragment, useState, useContext, useEffect } from 'react'
import { Dropdown, DropdownToggle } from "reactstrap"
import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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
      <Fragment>
        <ModalHeader>
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" onClick={props.modalToggle}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          Vote <span id="pink">{option}</span> by sending any amount of ETH to <br/>
          <a target="_" href='https://etherscan.io'><span id="pink">{option}</span>.{ENS}</a>
          <div className="poll-qr">
            <QRCode value={props.address[option]} />
          </div>
          To ensure that you vote counts, please link your ethereum account
          to your BrightID account at  <a target="_" href="https://ethereum.brightid.org">ethereum.brightid.org</a>
        </ModalBody>
      </Fragment>
     )
   }

  function AuthenticatedAndVerified({ option }){
    return(
      <Fragment>
        <ModalHeader>
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" onClick={props.modalToggle}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          <span className="vote-selection"> How much ETH will you burn to cast your vote? </span>
          <input type="number" autoFocus onChange={handleBurn} value={burnAmount} className="modal-input" placeholder="0.5 ETH"/>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal" onClick={() => makeTransaction(option)}>
            Vote {option}
          </button>
        </ModalFooter>
      </Fragment>
    )
  }

  function AuthenticatedAndUnverified(){
    return(
      <Fragment>
        <ModalHeader>
          <h5 className="modal-title">Please verify your account</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          Before casting your vote, you should verify your Ethereum account using BrightID.
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal">
            Verify
          </button>
        </ModalFooter>
      </Fragment>
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
      <Modal isOpen={props.modalState}>
        { state.web3 && state.verified && (<AuthenticatedAndVerified option={props.modalOption} />) }
        { !state.web3 && !state.verified && (< Unauthenticated option={props.modalOption} />) }
        { state.web3 && !state.verified && (<AuthenticatedAndUnverified />) }
      </Modal>
    </Fragment>
  )
}

export default Option
