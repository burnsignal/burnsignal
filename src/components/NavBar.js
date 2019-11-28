import React, { Component } from 'react';

class NavBar extends Component {

  render() {
    return(
      <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
        <div className="container-fluid">
          <div className="navbar-wrapper">

            <a className="navbar-brand" href={'/'}>Burn Signal</a>
          </div>

          <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span className="sr-only">Toggle navigation</span>
            <span className="navbar-toggler-icon icon-bar"></span>
            <span className="navbar-toggler-icon icon-bar"></span>
            <span className="navbar-toggler-icon icon-bar"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href={'/'}>
                  <i className="tim-icons icon-bell-55"></i>  Notifications
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )

  }
}

export default NavBar
