import React, { Fragment, useContext, useState, useEffect, useRef } from 'react'
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu, DropdownItemButton,
   Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledPopover as Popover,
   PopoverHeader, PopoverBody, Alert } from 'reactstrap';
import makeBlockie from 'ethereum-blockies-base64'
import { Link, useHistory, withRouter } from 'react-router-dom'
import { Col, Row, Container } from 'reactstrap'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../constants/parameters'

import { onHash, retrievePolls } from '../../constants/requests'
import { getAuthenicated } from '../../constants/calls/REST'
import { proofErrors } from '../../constants/operatives'
import { store } from '../../state'

import getWeb3 from '../../utils/getWeb3'
import profile from '../images/profile.png'
import brightid from '../images/brightid.png'
import logo from '../images/logo.png'

function Navigation(props) {
  const [ modal, setModal ] = useState({ route: false, create: false, about: false, network: false })
  const [ focus, setFocus ] = useState({ question: false, description: false })
  const [ dropdownComponent, setDropdown ] = useState(<Login />)
  const [ dropdownOpen, setDropdownOpen ] = useState(false)
  const [ navComponent, setNav ] = useState(<LoggedOut />)
  const [ popoverOpen, setPopoverOpen ] = useState(false)
  const [ pending, setPending ] = useState(false)

  let { dispatch, state } = useContext(store)
  let history = useHistory()

  const toggle = () => setDropdownOpen(prevState => !prevState)
  const poggle = () => setPopoverOpen(!popoverOpen)

  const initialiseWeb3 = async() => {
    try {
      const web3 = await getWeb3()
      await providerConfig(web3)

      window.ethereum.on('accountsChanged',
      () => providerConfig(web3))

    } catch(e) {
      alert('Web3 login could not be detected')
    }
  }

  const signOut = () => {
    dispatch({
      payload: {
        web3: false, auth: false, verified: false
      },
      type: 'WEB3'
    })
    setDropdown(<Login />)
    setNav(<LoggedOut />)
  }

 const providerConfig = async(web3) => {
    const accounts = await web3.eth.getAccounts()
    const network = await web3.eth.net.getId()
    const validity = state.authenicated.indexOf(accounts[0]) != -1
    const instance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)

    if(network !== 1){
      setModal({ ...modal, network: true  })
    }

    setNav(<LoggedIn verified={validity} account={accounts[0]}/>)
    setDropdown(<Logout account={accounts[0]}/>)

    dispatch({
      payload: {
        web3, accounts, instance, auth: true, verified: validity
      },
      type: 'WEB3'
    })
  }

  const selection = (option, route) => {
    if(!route) window.history.pushState({}, window.title, `/#/${option}`)
    setModal({
      ...modal, [option]: true, route
    })
  }

  const dismiss = (option) => {
    if(!modal.route) history.goBack()
    else history.push('/')
    setModal({
      ...modal, [option]: false, route: false
    })
  }

  function Login() {
    return(
      <Link to='/login'>
        <DropdownItem>Login</DropdownItem>
      </Link>
    )
  }

  function About() {
    return(
      <Modal isOpen={modal.about}>
        <ModalHeader>
           <h5 className='modal-title align-left'>About</h5>
            <button type='button' className='close' onClick={() => dismiss('about')}>
              <span aria-hidden='true'>&times;</span>
            </button>
        </ModalHeader>
        <ModalBody>
          <p>Burn Signal is an experiment in distributed preference signaling where verified unique
          users burn ETH to signal their opinion.</p>
          <p>Votes are weighted quadratically.</p>
          <p>We use <a id='pink' target='_' href='https://brightid.org'>BrightID</a> as our proof of uniqueness, only votes
          cast by ethereum addresses that are verified unique by BrightID count towards the outcome of
          a burn signals.</p><br/>
          <p>Burn Signal is funded by grants and community contributions. If you would like to contribute
          funds, check out our <a id='pink' target='_' href='https://gitcoin.co/grants/138/burner-vote'>Gitcoin Grants campaign</a>,
          if you would like to contribute code or other work, check out our <a id='pink' target='_' href='https://github.com/burnsignal'>
          GitHub</a> and our <a id='pink' target='_' href='https://colony.io/colony/burn'>Colony</a>.</p><br/>
          <p>Check out our <a id='pink' target='_' href='https://blog.burnsignal.io'> blog </a> for more information.</p>
        </ModalBody>
        <ModalFooter />
      </Modal>
     )
  }

  function Logout({ account }) {
    return(
      <Fragment>
        <DropdownItem type='button' onClick={() => selection('create')}> Create </DropdownItem>
        <Link to={`/profile/${account}`}>
          <DropdownItem> Profile </DropdownItem>
        </Link>
        <Link to='/logout'>
          <DropdownItem>Logout</DropdownItem>
        </Link>
      </Fragment>
    )
  }

  function LoggedIn({ verified, account }) {
    const e = verified === false ? 'grayscale(1)' : 'none'

    return(
      <Fragment>
      <Popover placement='bottom' target='popover'>
        <PopoverHeader>
        {verified && (<span> You're verified! </span> )}
        {!verified && (<span> Please verify. </span> )}
        </PopoverHeader>
        {!verified && (<PopoverBody>
          Please verify your account with <a href='https://ethereum.brightid.org' target='_target'>BrightID</a>.
        </PopoverBody>)}
        </Popover>
        <button type='button' id='popover' onClick={poggle}>
          <img src={brightid}  className='brightid-logo' style={{ filter: e }} />
        </button>
        <Link className='nav-link' to={`/profile/${account}`}>
          <img className='nav-profile' src={makeBlockie(account)} />
        </Link>
      </Fragment>
    )
  }

  function LoggedOut() {
    return(
      <Link className='nav-link' to='/login'>
        <div className='nav-profile-alt'>
          <i className='far fa-user-circle'></i>
        </div>
      </Link>
    )
  }

  function Create({ pending, submit }) {
    const [ component, setComponent ] = useState(<span />)
    const q = useRef()
    const d = useRef()

    const clearValues = () => {
      document.getElementsByClassName('modl-d')[0].value = ''
      document.getElementsByClassName('modl-q')[0].value = ''
    }

    const submitPoll = async() => {
      let [ question, description ] = [ q.current.value, d.current.value ]

      if(proofErrors(question, description)) {
        await clearValues()
        await setComponent(<Pending />)
        await submit(question, description)
      }
    }

    function Pending() {
      return (
        <ModalBody>
          <div class="pending-state">
            <div class="d-flex justify-content-center">
              <div class="spinner-grow text-primary" role="status" />
            </div>
            <p class="pending-text"> Pending... </p>
          </div>
        </ModalBody>
      )
    }

    function Content() {
      return (
        <ModalBody>
          <input name='question' ref={q} placeholder='Ask a question' className='create-poll-question modl-q' />
          <textarea name='description' ref={d} placeholder='Description' className='create-poll-description modl-d' />
          <button className='btn btn-primary button-poll' onClick={submitPoll}> Create </button>
        </ModalBody>
      )
    }

    useEffect(() => {
      setComponent(<Content />)
    }, [ pending ])

    return (
      <Modal isOpen={modal.create}>
        <ModalHeader>
          <h5 className='modal-title align-left'>Create</h5>
          <button type='button' className='close' onClick={() => dismiss('create')}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </ModalHeader>
        {component}
        <ModalFooter />
      </Modal>
    )
  }


  function WrongNetwork() {
    return(
      <Modal isOpen={modal.network}>
        <ModalHeader>
          <h5 className='modal-title align-left'>Incorrect network</h5>
        </ModalHeader>
        <ModalBody>
          Your web3 provider is on the incorrect network, please change to the main Ethereum network to proceed.
        </ModalBody>
        <ModalFooter />
      </Modal>
     )
  }

  const createPoll = async(question, description) => {
    let { web3, instance, accounts } = state

    const recentBlock = await web3.eth.getBlock('latest')
    const deadline = recentBlock.timestamp + 605000

    await instance.methods.newVoteProposal(
      question,
      description,
      deadline
    ).send({
      from: accounts[0]
    }).on('transactionHash', async(hash) => {
      await onHash(state, dispatch, hash, question, description)
    }).on('confirmation', async(confNum, receipt) => {
      await transactionAlert(receipt)
    })
  }

  const transactionAlert = async(receipt) => {
    await pluckDummy(receipt)
    await setPending(true)

    if(receipt.status == 1) {
      await retrievePolls(dispatch)
    }

    await dispatch({
      payload: { receipt },
      type: 'TX'
    })
  }

  const pluckDummy = (receipt) => {
    let { polls } = state

    delete polls[receipt.transactionHash]

    dispatch({
      payload: { polls },
      type: 'INIT'
    })
  }

  useEffect(() => {
    const checkRoute = async() => {
      if(props.location){
        if(props.location.pathname.match('about')) {
          selection('about', true)
        } else if(props.location.pathname.match('create')) {
          selection('create', true)
        } else if(props.location.pathname.match('login')) {
          await initialiseWeb3()
          history.goBack()
        } else if(props.location.pathname.match('logout')) {
          await signOut()
          history.goBack()
        }
      }
    }
    checkRoute()
  }, [ props.location.pathname ])

  return(
    <nav className='fixed-top'>
      <Container>
        <Row>
          <Col sm='12' md={{ size: 6, offset: 3 }}>
            <div className='navbar navbar-expand-lg'>
              <div className='navbar-wrapper'>
                <Link className='navbar-brand' to='/'>
                  <img className='navbar-logo' src={logo} />
                  <span className='navbar-title'> Burn Signal </span>
                </Link>
              </div>
              <ul className='navbar-nav'>
              <li className='nav-item'>
                {navComponent}
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret>
                    <i className='nav-login-icon tim-icons icon-minimal-down'></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link to='/'>
                      <DropdownItem> Home </DropdownItem>
                    </Link>
                    {dropdownComponent}
                    <DropdownItem divider />
                    <DropdownItem type='button' onClick={() => selection('about')}>About</DropdownItem>
                    <DropdownItem target='_' href='https://blog.burnsignal.io'>Blog</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </ul>
           </div>
         </Col>
       </Row>
       <Create submit={createPoll} pending={pending} />
       <WrongNetwork />
       <About />
     </Container>
    </nav>
  )
}

export default withRouter(Navigation)
