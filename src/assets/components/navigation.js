import React, { Fragment, useContext, useState, useEffect, useRef } from 'react'
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu, DropdownItemButton,
   Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import makeBlockie from 'ethereum-blockies-base64'
import { Link, useHistory, withRouter } from "react-router-dom"
import { Col, Row, Container } from "reactstrap"

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants/parameters"
import { store } from '../../state'

import getWeb3 from "../../utils/getWeb3"
import profile from "../images/profile.png"
import logo from "../images/logo.png"

function Navigation(props) {
  const [ modal, setModal ] = useState({ route: false, create: false, about: false, network: false })
  const [ focus, setFocus ] = useState({ question: false, description: false })
  const [ dropdownComponent, setDropdown ] = useState(<Login />)
  const [ dropdownOpen, setDropdownOpen ] = useState(false)
  const [ navComponent, setNav ] = useState(<LoggedOut />)
  const [ address, setAddress ] = useState("")
  const description = useRef(null)
  const question = useRef(null)

  let { dispatch, state } = useContext(store)
  let history = useHistory()

  const initialiseWeb3 = async() => {
    try {
      const web3 = await getWeb3()
      await providerConfig(web3)

      window.ethereum.on('accountsChanged',
      () => providerConfig(web3))

    } catch(e) {
      alert("Web3 login could not be detected")
    }
  }

  const signOut = () => {
    dispatch({
      payload: {
        web3: false, auth: false, verified: false
      },
      type: "WEB3"
    })
    setDropdown(<Login />)
    setNav(<LoggedOut />)
  }

 const providerConfig = async(web3) => {
    const accounts = await web3.eth.getAccounts()
    const network = await web3.eth.net.getId()
    const instance = new web3.eth.Contract(
      CONTRACT_ABI, CONTRACT_ADDRESS)

    if(network !== 4){
      setModal({ ...modal, network: true  })
    }

    setDropdown(<Logout account={accounts[0]}/>)
    setNav(<LoggedIn account={accounts[0]}/>)

    dispatch({
      payload: {
        web3, accounts, instance,
        auth: true, verified: true
      },
      type: "WEB3"
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
      <Link to="/login">
        <DropdownItem>Login</DropdownItem>
      </Link>
    )
  }

  function About() {
    return(
      <Modal isOpen={modal.about}>
        <ModalHeader>
           <h5 className="modal-title align-left">About</h5>
            <button type="button" className="close" onClick={() => dismiss('about')}>
              <span aria-hidden="true">&times;</span>
            </button>
        </ModalHeader>
        <ModalBody>
          <p>Burn Signal is an experiment in distributed preference signaling where verified unique
          users burn ETH to signal their opinion.</p>
          <p>Votes are weighted quadratically.</p>
          <p>We use <a id='pink' target="_" href="https://brightid.org">BrightID</a> as our proof of uniqueness, only votes
          cast by ethereum addresses that are verified unique by BrightID count towards the outcome of
          a burn signals.</p><br/>
          <p>Burn Signal is funded by grants and community contributions. If you would like to contribute
          funds, check out our <a id='pink' target="_" href="https://gitcoin.co/grants/138/burner-vote">Gitcoin Grants campaign</a>,
          if you would like to contribute code or other work, check out our <a id="pink" target="_" href="https://github.com/burnsignal">
          GitHub</a> and our <a id='pink' target="_" href="https://colony.io/colony/burn">Colony</a>.</p><br/>
          <p>Check out our <a id='pink' target="_" href="https://blog.burnsignal.io"> blog </a> for more information.</p>
        </ModalBody>
        <ModalFooter />
      </Modal>
     )
  }

  function Logout({ account }) {
    return(
      <Fragment>
        <DropdownItem type="button" onClick={() => selection('create')}> Create </DropdownItem>
        <Link to={`/profile/${account}`}>
          <DropdownItem> Profile </DropdownItem>
        </Link>
        <Link to="/logout">
          <DropdownItem>Logout</DropdownItem>
        </Link>
      </Fragment>
    )
  }

  function LoggedIn({ account }) {
    return(
      <Link className="nav-link" to={`/profile/${account}`}>
        <img className="nav-profile" src={makeBlockie(account)} />
      </Link>
    )
  }


  function LoggedOut() {
    return(
      <Link className="nav-link" to='/login'>
        <div className="nav-profile-alt">
          <i className="far fa-user-circle"></i>
        </div>
      </Link>
    )
  }

  function Create() {
    return(
      <Modal isOpen={modal.create}>
        <ModalHeader>
          <h5 className="modal-title align-left">Create</h5>
          <button type="button" className="close" onClick={() => dismiss('create')}>
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          <input name="question" ref={question} placeholder="Ask a question" className="create-poll-question" />
          <textarea name="description" ref={description} placeholder="Description" className="create-poll-description" />
          <button className="btn btn-primary button-poll" onClick={createPoll}> Create </button>
        </ModalBody>
        <ModalFooter />
      </Modal>
     )
  }

  function WrongNetwork() {
    return(
      <Modal isOpen={modal.network}>
        <ModalHeader>
          <h5 className="modal-title align-left">Incorrect Network</h5>
        </ModalHeader>
        <ModalBody>
          Your web3 provider is on the incorrect network, please change to
          Rinkeby testnet to proceed.
        </ModalBody>
        <ModalFooter />
      </Modal>
     )
  }

  const clearValues = () => {
    document.getElementsByClassName("create-poll-description")[0].value = ""
    document.getElementsByClassName("create-poll-question")[0].value = ""
  }

  const createPoll = async() => {
    let { web3, instance, accounts } = state

    const recentBlock = await web3.eth.getBlock("latest")
    const deadline = recentBlock.timestamp + 604800

    await instance.methods.newVoteProposal(
      question.current.value,
      description.current.value,
      deadline
    ).send({
      from: accounts[0]
    }).on('transactionHash', (hash) => {
      dismiss('create')
      clearValues()
    })
  }

  const toggle = () => setDropdownOpen(prevState => !prevState);

    useEffect(() => {
      const checkRoute = async() => {
        if(props.location){
          if(props.location.pathname.match('about')) selection('about', true)
          else if(props.location.pathname.match('create'))selection('create', true)
          else if(props.location.pathname.match('login')) {
            initialiseWeb3()
            history.push('/')
          } else if(props.location.pathname.match('logout')) {
            signOut()
            history.push('/')
          }
        }
      }
     checkRoute()
   }, [ props.location.pathname ])

  return(
    <nav className="fixed-top">
      <Container>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <div className="navbar navbar-expand-lg">
              <div className="navbar-wrapper">
                <Link className="navbar-brand" to="/">
                  <img className="navbar-logo" src={logo} />
                  <span className="navbar-title"> Burn Signal </span>
                </Link>
              </div>
              <ul className="navbar-nav">
              <li className="nav-item">
                {navComponent}
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret>
                    <i className="nav-login-icon tim-icons icon-minimal-down"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link to="/">
                      <DropdownItem> Home </DropdownItem>
                    </Link>
                    {dropdownComponent}
                    <DropdownItem divider />
                    <DropdownItem type="button" onClick={() => selection('about')}>About</DropdownItem>
                    <DropdownItem target="_" href="https://blog.burnsignal.io">Blog</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </ul>
           </div>
         </Col>
       </Row>
       <WrongNetwork />
       <Create />
       <About />
     </Container>
    </nav>
  )
}

export default withRouter(Navigation)
