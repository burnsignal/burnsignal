import React, { Fragment, useContext, useState, useEffect } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Col, Row } from "reactstrap"

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants/parameters"
import getWeb3 from "../../utils/getWeb3"
import logo from "../images/logo.png"
import { store } from '../../state'

function Navigation() {
  const [ dropdownComponent, setDropdown ] = useState(<Login />)
  const [ dropdownOpen, setDropdownOpen ] = useState(false)
  const [ navComponent, setNav ] = useState(<Fragment />)
  const [ description, setDescription ] = useState("")
  const [ question, setQuestion ] = useState("")
  const [ address, setAddress ] = useState("")
  const [ focus, setFocus ] = useState({})

  let { dispatch, state } = useContext(store)

  async function initialiseWeb3(){
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const instance = new web3.eth.Contract(
        CONTRACT_ABI, CONTRACT_ADDRESS)
      dispatch({
        payload: {
          web3, accounts, instance
        },
        type: "WEB3"
      })
      setDropdown(<Logout account={accounts[0]}/>)
      setNav(<LoggedIn account={accounts[0]}/>)
    } catch(e) {
      alert("Web3 login could not be detected")
    }
  }

  function Login() {
    return(
      <DropdownItem onClick={() => initialiseWeb3()}>Login</DropdownItem>
    )
  }

  function About() {
    return(
      <div className="modal fade" id="about" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-left">About</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body about">
              <p>Burn Signal is an experiment in distributed preference signaling where verified unique
              users burn ETH to signal their opinion.</p>
              <p>Votes are weighted quadratically.</p>
              <p>We use <a target="_" href="https://brightid.org">BrightID</a> as our proof of uniqueness, only votes
              cast by ethereum addresses that are verified unique by BrightID count towards the outcome of
              a burn signals.</p><br/>
              <p>Burn Signal is funded by grants and community contributions. If you would like to contribute
              funds, check out our <a target="_" href="https://gitcoin.co/grants/138/burner-vote">Gitcoin Grants campaign</a>,
              if you would like to contribute code or other work, check out our <a target="_" href="https://github.com/burnsignal">
              GitHub</a> and our <a target="_" href="https://colony.io/colony/burn">Colony</a>.</p><br/>
              <p>Check out our <a target="_" href="https://blog.burnsignal.io"> blog </a> for more information.</p>
            </div>
          </div>
        </div>
      </div>
     )
  }

  function Logout({ account }) {
    return(
      <Fragment>
        <DropdownItem type="button" data-target="#create" data-toggle="modal"> Create </DropdownItem>
        <Link to={`/profile/${account}`}>
          <DropdownItem> Profile </DropdownItem>
        </Link>
        <DropdownItem>Logout</DropdownItem>
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

  function Create() {
    return(
      <div className="modal fade" id="create" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-left">Create</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body about">
              <input autoFocus={focus.question} onMouseEnter={triggerFocus} onMouseLeave={leaveFocus} name="question" value={question} onChange={handleQuestion} placeholder="What question is on your mind?" className="create-poll-question" />
              <textarea autoFocus={focus.description} name="description" onMouseEnter={triggerFocus} onMouseLeave={leaveFocus} value={description} onChange={handleDescription} placeholder="Description" className="create-poll-description" />
              <button className="btn btn-primary button-poll" onClick={createPoll}> Create </button>
            </div>
          </div>
        </div>
      </div>
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

    await instance.methods.newVoteProposal(question,
      description,
      deadline
    ).send({
      from: accounts[0]
    }).on('transactionHash', (hash) => {
      clearValues()
    })
  }

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleQuestion = (e) => {
    setQuestion(e.target.value)
  }

  const triggerFocus = (e) => {
    setFocus({ [e.target.name]: true })
  }

  const leaveFocus = (e) => {
    setFocus({ [e.target.name]: false })
  }

  return(
    <Row>
      <Col sm="12" md={{ size: 8, offset: 2 }}>
        <nav className="navbar navbar-expand-lg fixed-top col-sm-12 col-md-7">
        <div className="navbar-wrapper">
          <Link className="navbar-brand" to="/">
            <img className="navbar-logo" src={logo} />
            <span className="navbar-title"> Burn Signal </span>
          </Link>
        </div>
        <div className="collapse navbar-collapse justify-content-end">
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
                   <DropdownItem type="button" data-target="#about" data-toggle="modal">About</DropdownItem>
                   <DropdownItem target="_" href="https://blog.burnsignal.io">Blog</DropdownItem>
                 </DropdownMenu>
               </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
     </Col>
    <About />
    <Create />
   </Row>
  )
}

export default Navigation
