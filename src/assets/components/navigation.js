import React, { Fragment, useContext, useState, useEffect } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Col, Row } from "reactstrap"

import getWeb3 from "../../utils/getWeb3"
import logo from "../images/logo.png"
import { store } from '../../state'

function Navigation() {
  const [ dropdownComponent, setDropdown ] = useState(<Login />)
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ navComponent, setNav ] = useState(<Fragment />)
  const [ address, setAddress ] = useState("")

  const toggle = () => setDropdownOpen(prevState => !prevState);

  let { dispatch, state } = useContext(store)

  async function initialiseWeb3(){
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      setNav(<LoggedIn account={accounts[0]}/>)
      setDropdown(<Logout />)
      dispatch({
        payload: web3,
        type: "WEB3"
      })
    } catch(e) {
      alert("Web3 login could not be detected")
    }
  }

  function Login() {
    return(
      <DropdownItem onClick={() => initialiseWeb3()}>Login</DropdownItem>
    )
  }

  function Logout() {
    return(
      <Fragment>
        <DropdownItem>Create</DropdownItem>
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
                   <DropdownItem>Home</DropdownItem>
                   {dropdownComponent}
                   <DropdownItem divider />
                   <DropdownItem>About</DropdownItem>
                   <DropdownItem>Blog</DropdownItem>
                 </DropdownMenu>
               </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
     </Col>
   </Row>
  )
}

export default Navigation
