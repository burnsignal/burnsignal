import React, { Fragment, useContext, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { useParams } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import '../assets/css/profile.css'
import { store } from '../state'

function Profile() {
  let { address } = useParams()

  return (
    <div className="profileComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <img className="profile-blockie" src={makeBlockie(address)} />
              <div className="profile-address">{address}</div>
            </div>
            <div className="card-body">
              STATS
            </div>
          </div>
        </Col>
      </Row>
   </div>
  )
}

export default Profile
