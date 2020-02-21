import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom"
import makeBlockie from 'ethereum-blockies-base64'
import { Row, Col } from "reactstrap"

import { getVoteInfo, getRecords, ETH, chartId, toChecksumAddress } from '../constants/operatives'
import { getPollMetadata } from "../constants/calls/GraphQL"
import { store } from '../state'

import Spline from '../assets/components/charts/spline'
import Option from '../assets/components/option'
import Bar from '../assets/components/charts/bar'

function Poll(props){
  const [ pollOptions, setOptions ] = useState({ yes: "", no : "" })
  const [ pollCount, setCount ] = useState({ yes: 0, no: 0 })
  const [ pollDescription , setDescription ] = useState("")
  const [ graphState, setGraphState ] = useState(false)
  const [ uniqueAddresses, setUnique ] = useState(0)
  const [ totalPledged, setPledged ] = useState(0)
  const [ pollAuthor, setAuthor ] = useState("0x")
  const [ pollRecords, setRecords ] = useState({})
  const [ modalOption, setOption ] = useState("")
  const [ modalState, setModal ] = useState("")
  const [ pollTopic, setTopic ] = useState("")
  const [ pledgedUSD, setUSD ] = useState(0)

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

  function dismiss() {
    let route = props.location.pathname.replace('/yes', '')
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
        let records = await getRecords(users)
        let total = ETH(ethValue)

        setCount({ yes: parseInt(yes), no: parseInt(no) })
        setOptions({ yes: optionAaddr, no: optionBaddr })
        setAuthor(toChecksumAddress(issuer))
        setUnique(records.voters.length)
        setUSD(usdValue.toFixed(2))
        setRecords({ ...records })
        setDescription(body)
        setGraphState(true)
        setPledged(total)
        setTopic(title)
        }
     }
    getMetadata()
  }, [ state.polls ])

  useEffect(() => {
    if(props.location){
      if(props.location.pathname.match('yes')) triggerModal('yes', false)
      else if(props.location.pathname.match('no')) triggerModal('no', false)
    }
  }, [])

  return(
     <div className="poll">
      <Row>
      <Option modalOption={modalOption} modalToggle={dismiss} modalState={modalState} title={pollTopic} address={pollOptions} />
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <Link className="poll-issuer" to={`/profile/${pollAuthor}`}>
                <img className="poll-profile" src={makeBlockie(pollAuthor)} />
              </Link>
              <div className="poll-title">{pollTopic}</div>
            </div>
            <div className="card-body">
              <div className="poll-description">{pollDescription}</div>
              <div className="vote-options">
                <a href="javascript:void(0);" className="btn btn-simple" onClick={() => triggerModal("yes", true)}>Yes</a>
                <a href="javascript:void(0);" className="btn btn-simple" onClick={() => triggerModal("no", true)}>No</a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-category">Results</h3>
            </div>
            <div className="card-body">
              {graphState && (
                <Bar type={false} chartId={chartId(id)} pollCount={pollCount}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-category">Details</h3>
            </div>
            <div className="card-body">
              <div class="poll-details">
                <i id="pink" className="tim-icons icon-single-02"/>&nbsp;&nbsp;{uniqueAddresses}
                <i id="pink" className="tim-icons icon-wallet-43"/>&nbsp;&nbsp;{totalPledged}
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
