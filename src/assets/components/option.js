import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
import { Dropdown, DropdownToggle, Col, Row, Button, Modal, ModalHeader,
  ModalBody, ModalFooter } from 'reactstrap'
import { Link } from "react-router-dom"

import { createURL } from "../../constants/operatives"
import { store } from "../../state"

const QRCode = require('qrcode.react')

function Option(props) {
  const ENS = `${createURL(props.title)}.burnsignal.eth`
  const burn = useRef(null)

  let { state } = useContext(store)
  let { title } = props

  function Unauthenticated({ option }){
    const [ queryLogin , setQuery ] = useState(true)

    if(queryLogin){
      return(
      <Fragment className="queryLogin">
        <ModalHeader>
          <h5 className="modal-title">Log in to vote.</h5>
          <button type="button" className="close" onClick={props.modalToggle}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalFooter>
          <button type="button" className="btn btn-secondary" onClick={() => setQuery(false)}>
            Vote without authentication
          </button>
          <Link to='/login' onClick={props.modalToggle}>
            <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal" >
              Login
            </button>
          </Link>
        </ModalFooter>
      </Fragment>
     )
   } else if(!queryLogin) {
      return(
      <Fragment>
        <ModalHeader>
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" onClick={props.modalToggle}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody className="align-center">
          Vote <span id="pink">{option}</span> by sending any amount of ETH to <br/>
          <a target="_"  id="pink" href={`https://etherscan.io/address/${props.address[option]}`}>{props.address[option]}</a>
          <div className="poll-qr">
            <QRCode includeMargin size={200} value={props.address[option]} />
          </div>
          To ensure that you vote counts, please link your ethereum account
          to your BrightID account at  <a target="_" href="https://ethereum.brightid.org">ethereum.brightid.org</a>
        </ModalBody>
      </Fragment>
     )
   }
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
          <input type="number" ref={burn} className="modal-input" placeholder="0.5 ETH"/>
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

    const amount = burn.current.value % 1 === 0 ?
      web3.utils.toBN(parseFloat(burn.current.value)).mul(web3.utils.toBN(1e18)) :
      parseInt(burn.current.value*Math.pow(10,18))

    await web3.eth.sendTransaction({
        to: props.address[option],
        from: state.accounts[0],
        value: amount
      }).on('transactionHash' , () => {
        props.modalToggle()
      })
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
