import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom'
import makeBlockie from 'ethereum-blockies-base64'
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'
import ReactMarkdown from 'react-markdown'

import { getVoteInfo, getQuadratics, getRecords, ETH, chartId, toChecksumAddress } from '../constants/operatives'
import { getPollMetadata } from '../constants/calls/GraphQL'
import ethereum from '../assets/images/ethereum.png'
import { store } from '../state'

import Spline from '../assets/components/charts/spline'
import Option from '../assets/components/option'
import Bar from '../assets/components/charts/bar'

function Poll(props){
  const [ pollOptions, setOptions ] = useState({ yes: '', no : '' })
  const [ pollCount, setCount ] = useState({ yes: 0, no: 0 })
  const [ pollDescription , setDescription ] = useState('')
  const [ graphState, setGraphState ] = useState(false)
  const [ uniqueAddresses, setUnique ] = useState(0)
  const [ totalPledged, setPledged ] = useState(0)
  const [ pollAuthor, setAuthor ] = useState('0x')
  const [ pollRecords, setRecords ] = useState({})
  const [ modalOption, setOption ] = useState('')
  const [ modalState, setModal ] = useState('')
  const [ pollTopic, setTopic ] = useState('')
  const [ pledgedUSD, setUSD ] = useState(0)
  const [ metaState, setMeta ] = useState(false)

  let { state } = useContext(store)
  let { address } = useParams()
  let history = useHistory()

  const id = props.location !== undefined ? address : props.id

  const toggle = () => setModal(!modalState)

  function triggerModal(option, bool) {
    var route = `${props.location.pathname}/${option}`

    if(bool && history[history.length-1] !== route){
      history.push(route)
    }
    setOption(option)
    toggle()
  }

  function dismiss(transaction) {
    let route = props.location.pathname.replace('/yes', '')

    if(transaction) setMeta(transaction)

    route = route.replace('/no', '')
    history.push(route)
    toggle()
  }

  useEffect(() => {
    const getMetadata = async() => {
      if(state.polls[id] !== undefined){
        let { title, body, issuer, optionAaddr, optionBaddr } = state.polls[id]
        var pollMetadata = await getPollMetadata(title)

        let { yes, users, no } = pollMetadata
        let ethValue = parseInt(yes) + parseInt(no)
        let usdValue = state.price * ethValue/Math.pow(10,18)
        let records = await getRecords(state.authenicated, users)
        let quadratics = await getQuadratics(records)
        let total = ETH(ethValue)

        setCount({ yes: quadratics[0], no: quadratics[1] })
        setOptions({ yes: optionAaddr, no: optionBaddr })
        setAuthor(toChecksumAddress(issuer))
        setUnique(records.voters.length)
        setUSD(usdValue.toFixed(2))
        setRecords({ ...records })
        setDescription(body)
        setGraphState(true)
        setPledged(total)
        setTopic(title)
        setMeta(false)
        }
     }
    getMetadata()
  }, [ metaState,
    state.polls ]
  )

  useEffect(() => {
    if(props.location){
      if(props.location.pathname.match('yes')) triggerModal('yes', false)
      else if(props.location.pathname.match('no')) triggerModal('no', false)
    }
  }, [])

  return(
     <div className='poll'>
      <MetaTags>
        <title>{pollTopic}</title>
        <meta property='og:title' content={pollTopic} />
        <meta property='og:description' content={pollDescription} />
        <meta name='twitter:title' content={pollTopic}/>
        <meta name='twitter:description' content={pollDescription} />
      </MetaTags>
      <Row>
      <Option modalOption={modalOption} modalToggle={dismiss} modalState={modalState} title={pollTopic} address={pollOptions} />
        <Col sm='12' md={{ size: 6, offset: 3 }}>
          <div className='card'>
            <div className='card-header'>
              <Link className='poll-issuer' to={`/profile/${pollAuthor}`}>
                <img className='poll-profile' src={makeBlockie(pollAuthor)} />
              </Link>
              <div className='poll-info'>
                <div className='poll-title'>{pollTopic}</div>
                <div className='poll-description'><ReactMarkdown source={pollDescription} /></div>
              </div>
            </div>
            <div className='card-body vote-body'>
              <div className='vote-options'>
                <button className='btn btn-simple' onClick={() => triggerModal('yes', true)}>Yes</button>
                <button className='btn btn-simple' onClick={() => triggerModal('no', true)}>No</button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm='12' md={{ size: 6, offset: 3 }}>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-category'>Results</h3>
            </div>
            <div className='card-body'>
              {graphState && (
                <Bar type={false} chartId={chartId(id)} pollCount={pollCount}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm='12' md={{ size: 6, offset: 3 }}>
          <div className='card'>
            <div className='card-header'>
              <h3 className='card-category'>Details</h3>
            </div>
            <div className='card-body'>
              <div class='poll-details'>
                <i id='pink' className='far fa-user'/>&nbsp;&nbsp;{uniqueAddresses}
                <img src={ethereum} className='eth-icon-xl'/>&nbsp;&nbsp;{totalPledged}
                &nbsp;&nbsp;|&nbsp;&nbsp;${pledgedUSD}
              </div>
              {graphState && (
                <Spline chartId={chartId(id)} pollRecords={pollRecords} />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Poll
