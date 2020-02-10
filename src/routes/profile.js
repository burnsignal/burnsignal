import React, { useState, useContext, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { useParams } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import { getProfileMetadata } from '../constants/calls/GraphQL'
import { ETH } from '../constants/operatives'
import { store } from '../state'

import '../assets/css/profile.css'

function Profile() {
  const [ totalBurned, setBurned ] = useState(0)

  let { address } = useParams()

  useEffect(() => {
    const gatherProfile = async() => {
      var profileMetadata = await getProfileMetadata(address)

      let { burned, polls, burns } = profileMetadata

      setBurned(ETH(burned))
    }
    gatherProfile()
   }
  , [])

  return (
    <div className="profileComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <img className="profile-blockie" src={makeBlockie(address)} />
              <div className="profile-stats">
                <div className="profile-address">{address}</div>
                <span className="profile-burned">Burned: {totalBurned} </span>
              </div>
            </div>
            <div className="card-body" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-category">Polls</h3>
            </div>
            <div className="card-body" />
          </div>
        </Col>
      </Row>
   </div>
  )
}

export default Profile
