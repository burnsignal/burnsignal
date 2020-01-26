import React, { Component } from 'react'
import { Dropdown, DropdownToggle } from "reactstrap"

import logo from "../images/logo.png"

function Navigation() {

  return(
    <nav className="navbar navbar-expand-lg fixed-top ">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <a className="navbar-brand" href={'/'}>
            <img className="navbar-logo" src={logo} />
            <span className="navbar-title"> Burn Signal </span>
          </a>
        </div>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href={'/'}>
                 Notifications <i className="nav-icon tim-icons icon-bell-55"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={'/'}>
                 Login <i className="nav-login-icon tim-icons icon-minimal-down"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
