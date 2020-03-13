import React, { useState, useContext, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { useParams, Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'

import { ETH, toChecksumAddress, createURL } from '../constants/operatives'
import { getProfileMetadata, getPollAddress } from '../constants/calls/GraphQL'
import brightid from '../assets/images/brightid.png'
import { store } from '../state'

function Profile() {
  const [ isAuthenicated, setAuth ] = useState(false)
  const [ totalBurned, setBurned ] = useState(0)
  const [ userPolls, setPolls ] = useState([])
  const [ totalVotes, setVotes ] = useState(0)
  const [ avgBurned, setAvg ] = useState(0)

  let { state } = useContext(store)
  let { address } = useParams()

  useEffect(() => {
    const gatherProfile = async() => {
      var auth = state.authenicated.indexOf(toChecksumAddress(address))
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
      setAuth(auth != -1)
      setPolls(records)
    }
    if(state.authenicated) gatherProfile()
   }
  , [ state ])

  return (
    <div className='profile'>
      <Row>
        <MetaTags>
          <title>Burn Signal</title>
          <meta property='og:title' content='Burn Signal' />
          <meta property='og:description' content='Got an opinion? Burn ETH to prove it.' />
          <meta property='twitter:title' content='Burn Signal' />
          <meta property='twitter:description' content='Got an opinion? Burn ETH to prove it.' />
        </MetaTags>
        <Col sm='12' md={{ size: 6, offset: 3 }}>
          <div className='card'>
            <div className='card-header'>
                <Link to={`/profile/${address}`}>
                  <img className='profile-blockie' src={makeBlockie(address)} />
                </Link>
                <div className='profile-address'>
                  <a href={`https://etherscan.io/address/${address}`}>
                    {toChecksumAddress(address)}
                  </a>
                  <img className='brightid-logo' src={brightid}
                    style={{ filter: !isAuthenicated ? 'grayscale(100%)' : 'none' }}/>
                </div>
              <div className='profile-traits'>
                <ul>
                  <li>Burned: <span id='pink'>{totalBurned}</span> </li>
                  <li>Burns: <span id='pink'>{totalVotes}</span> </li>
                  <li>Average: <span id='pink'>{avgBurned}</span> </li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm='12' md={{ size: 6, offset: 3 }}>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-category'>Polls</h3>
            </div>
            <div className='card-body' />
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
