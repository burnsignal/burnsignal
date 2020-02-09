import React, { Fragment, useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom"
import { Row, Col } from "reactstrap"

import { getVoteInfo, getRecords } from '../constants/operatives'
import { getPollMetadata } from "../constants/calls/GraphQL"
import { chartId } from "../constants/operatives"
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
  const [ pollTopic , setTopic ] = useState("")

  let { state } = useContext(store)
  let { address } = useParams()
  let history = useHistory()

  const id = props.location !== undefined ? address : props.id

  function selection(option) {
    const route = `/poll/${id}/${option}`
    if(history[history.length-1] !== route){
      history.push(route)
    }
  }

  function dismiss() {
    let route = props.location.pathname.replace('/yes', '')
    route = route.replace('/no', '')
    history.push(route)
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
        setUnique(records.voters.length)
        setRecords({ ...records })
        setDescription(body)
        setGraphState(true)
        setTopic(title)
        }
     }
    getMetadata()
  }, [ state ])

  return(
     <div className="proposalComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <div className="poll-title">{pollTopic}</div>
            </div>
            <div className="card-body">
              <div className="poll-description">{pollDescription}</div>
              <div className="vote-options">
                <button type="button" data-target="#yes" data-toggle="modal" className="btn btn-primary btn-simple" onClick={() => selection("yes")}>Yes</button>
                <button type="button" data-target="#no" data-toggle="modal" className="btn btn-primary btn-simple" onClick={() => selection("no")}>No</button>
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
      </Row>
      <Option dismiss={dismiss} title={pollTopic} address={pollOptions} />
    </div>
  )
}

export default Poll
