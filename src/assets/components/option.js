import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
import { Dropdown, DropdownToggle, Col, Row, Button, Modal, ModalHeader,
  ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'

import { retrievePolls } from '../../constants/requests'
import { createURL } from '../../constants/operatives'
import { store } from '../../state'

const QRCode = require('qrcode.react')

function Option(props) {
  const [ queryState, setQuery ] = useState(true)
  const [ pendingState, setPending ] = useState(false)

  let { state, dispatch } = useContext(store)
  let { title } = props

  function Unauthenticated({ option }){
    return(
      <Fragment>
        <ModalHeader>
          {props.title}
          <button type='button' className='close' onClick={props.modalToggle}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </ModalHeader>
        <ModalBody className='align-center'>
          Vote <span id='pink'>{option}</span> by sending any amount of ETH to <br/>
          <a target='_'  id='pink' href={`https://etherscan.io/address/${props.address[option]}`}>{props.address[option]}</a>
          <div className='poll-qr'>
            <QRCode includeMargin size={200} value={props.address[option]} />
          </div>
          To ensure that you vote counts, please link your ethereum account
          to your BrightID account at  <a target='_' href='https://ethereum.brightid.org'>ethereum.brightid.org</a>
        </ModalBody>
        <ModalFooter />
      </Fragment>
     )
   }

  function AuthenticatedAndVerified({ option, pending }){
    const [ component, setComponent ] = useState(<span />)
    const [ burn, setBurn ] = useState(null)

    const submitPoll = async(option) => {
      let amount = burn

      await setBurn(null)
      await setComponent(<Pending />)
      await makeTransaction(option, burn)
    }

    const handleBurn = event => {
      setBurn(event.target.value)
    }

    function Pending() {
      return (
        <Fragment>
          <ModalBody>
            <div class="pending-state">
              <div class="d-flex justify-content-center">
                <div class="spinner-grow text-primary" role="status" />
              </div>
              <p class="pending-text"> Pending... </p>
            </div>
          </ModalBody>
        </Fragment>
      )
    }

    function Content() {
      return(
        <Fragment>
          <ModalBody>
            <span className='vote-selection'> How much ETH will you burn to cast your vote? </span>
            <input type='number' value={burn} onChange={handleBurn} className='modal-input' placeholder='0.5 ETH'/>
          </ModalBody>
          <ModalFooter>
            <button type='button' className='btn btn-primary btn-verify' data-dismiss='modal' onClick={() => submitPoll(option)}>
              Vote {option}
            </button>
          </ModalFooter>
        </Fragment>
      )
    }

    useEffect(() => {
      setComponent(<Content />)
    }, [ pending,  ])

    return(
      <Fragment>
        <ModalHeader>
          <h5 className='modal-title'>{props.title}</h5>
          <button type='button' className='close' onClick={props.modalToggle}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </ModalHeader>
        {component}
      </Fragment>
    )
  }

  function AuthenticatedAndUnverified(){
    return(
      <Fragment>
        <ModalHeader>
          <h5 className='modal-title'>Please verify your account</h5>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={props.modalToggle}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          Before casting your vote, you should verify your Ethereum account using BrightID.
        </ModalBody>
        <ModalFooter>
          <a className='btn btn-primary btn-verify' href='https://ethereum.brightid.org/' target='_blank' >
            Verify
          </a>
        </ModalFooter>
      </Fragment>
     )
  }

  function Query(){
    return(
    <div className='queryLogin'>
      <ModalHeader>
        Log in to vote.
        <button type='button' className='close' onClick={() => setQuery(false)}>
          <span aria-hidden='true'>&times;</span>
        </button>
      </ModalHeader>
      <ModalFooter>
        <button type='button' className='btn btn-secondary' onClick={() => setQuery(false)}>
          Vote without authentication
        </button>
        <Link to='/login' onClick={props.modalToggle}>
          <button type='button' className='btn btn-primary btn-verify' data-dismiss='modal' >
            Login
          </button>
        </Link>
      </ModalFooter>
    </div>
   )
 }

  const makeTransaction = async(option, burn) => {
    const amount = parseFloat(burn) % 1 === 0 ?
      state.web3.utils.toBN(parseFloat(burn).toString()).mul(state.web3.utils.toBN(1e18)) :
      parseInt(burn * Math.pow(10,18)).toString()

    await state.web3.eth.sendTransaction({
        to: props.address[option],
        from: state.accounts[0],
        value: amount
      }).on('transactionHash', async(hash) => {
        await setPending(!pendingState)
        await props.modalToggle()
      }).on('confirmation', async(confNum, receipt) => {
        await transactionAlert(receipt, true)
      }).catch(async(data) => {
        await transactionAlert({
           status: 2
         }, false)
      })
  }

  const transactionAlert = async(receipt, broadcast) => {
    if(receipt.status == 1) await retrievePolls(dispatch)
    if(!broadcast) await props.modalToggle()

    await dispatch({
      payload: { ...receipt },
      type: 'TX'
    })
  }

  useEffect(() => {
    if(state.web3) setQuery(false)
  }, [ state.web3 ])

  return (
    <Fragment>
      <Modal isOpen={!queryState && props.modalState}>
        { state.web3 && state.verified && (<AuthenticatedAndVerified pending={pendingState} option={props.modalOption} />) }
        { !state.web3 && !state.verified && (<Unauthenticated option={props.modalOption} />) }
        { state.web3 && !state.verified && (<AuthenticatedAndUnverified />) }
      </Modal>
      <Modal isOpen={queryState && props.modalState}>
        <Query />
      </Modal>
    </Fragment>
  )
}

export default Option
