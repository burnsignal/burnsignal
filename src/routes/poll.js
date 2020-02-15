import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom"
import makeBlockie from 'ethereum-blockies-base64'
import { Row, Col } from "reactstrap"

import { getVoteInfo, getRecords } from '../constants/operatives'
import { getPollMetadata } from "../constants/calls/GraphQL"
import { chartId, toChecksumAddress } from "../constants/operatives"
import { store } from '../state'

import Spline from '../assets/components/charts/spline'
import Option from '../assets/components/option'
import Bar from '../assets/components/charts/bar'

import "../assets/css/poll.css"


function Poll(props){
  const [ pollRecords, setRecords ] = useState({ yes: [], no: [] })
  const [ pollOptions, setOptions ] = useState({ yes: "", no : "" })
  const [ pollCount, setCount ] = useState({ yes: 0, no: 0 })
  const [ pollDescription , setDescription ] = useState("")
  const [ graphState, setGraphState ] = useState(false)
  const [ uniqueAddresses, setUnique ] = useState(0)
  const [ totalPledged, setPledged ] = useState(0)
  const [ pollAuthor, setAuthor ] = useState("0x")
  const [ pollTopic , setTopic ] = useState("")
  const [ modalState , setModal ] = useState("")
  const [ modalOption , setOption ] = useState("")

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
        let records = await getRecords(users)

        setCount({ yes: parseInt(yes), no: parseInt(no) })
        setOptions({ yes: optionAaddr, no: optionBaddr })
        setAuthor(toChecksumAddress(issuer))
        setUnique(records.voters.length)
        setRecords({ ...records })
        setDescription(body)
        setGraphState(true)
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
                <button type="button" className="btn btn-simple" onClick={() => triggerModal("yes", true)}>Yes</button>
                <button type="button" className="btn btn-simple" onClick={() => triggerModal("no", true)}>No</button>
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
                <Bar chartId={chartId(id)} pollCount={pollCount}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-category">History</h3>
            </div>
            <div className="card-body">
              {graphState && (
                <Spline chartId={chartId(id)} pollRecords={pollRecords} />
              )}
            </div>
          </div>
        </Col>
        <Option modalOption={modalOption} modalToggle={dismiss} modalState={modalState} title={pollTopic} address={pollOptions} />
      </Row>
    </div>
  )
}

export default Poll
