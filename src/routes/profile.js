import React, { useState, useContext, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { useParams, Link } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import { ETH, toChecksumAddress, createURL } from '../constants/operatives'
import { getProfileMetadata, getPollAddress } from '../constants/calls/GraphQL'
import { store } from '../state'

function Profile() {
  const [ totalBurned, setBurned ] = useState(0)
  const [ userPolls, setPolls ] = useState([])
  const [ totalVotes, setVotes ] = useState(0)
  const [ avgBurned, setAvg ] = useState(0)

  let { address } = useParams()

  useEffect(() => {
    const gatherProfile = async() => {
      var profileMetadata = await getProfileMetadata(address)
      var records = []

      let { burned, polls, burns } = profileMetadata

      for(var x = 0; x < polls.length; x++){
        var route = await getPollAddress(polls[x])
        if(polls[x] != 'question'){
          records.push({
           address: route , title: polls[x]
         })
        }
      }

      setAvg(ETH(parseInt(burned)/burns.length))
      setVotes(burns.length)
      setBurned(ETH(burned))
      setPolls(records)
    }
    gatherProfile()
   }
  , [])

  return (
    <div className="profile">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <Link to={`/profile/${address}`}>
                <img className="profile-blockie" src={makeBlockie(address)} />
                <div className="profile-address">
                  <a href={`https://etherscan.io/address/${address}`}>{toChecksumAddress(address)}</a>
                </div>
              </Link>
              <div className="profile-stats">
                <span className="profile-stat">Burned: <span id="pink">{totalBurned}</span> </span>
                <span className="profile-stat">Burns: <span id="pink">{totalVotes}</span> </span>
                <span className="profile-stat">Average: <span id="pink">{avgBurned}</span> </span>
                <p className="profile-verified">Verified: <span id="pink">false</span> </p>
              </div>
            </div>
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
              <ul>
              {userPolls.map(value => (
                <Link to={`/poll/${value.address}`}>
                  <li> {value.title} </li>
                </Link>
              ))}
              </ul>
          </div>
        </Col>
      </Row>
   </div>
  )
}

export default Profile
