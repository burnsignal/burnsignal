import React, { Fragment, useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import { Row, Col } from "reactstrap"

import { getPollMetadata } from "../constants/calls/GraphQL"
import { getVoteInfo } from '../constants/operatives'
import { chartId } from "../constants/operatives"
import { store } from '../state'

import Spline from '../assets/components/charts/spline'
import Bar from '../assets/components/charts/bar'

import "../assets/css/proposal.css"

const getRecords = async(users, type) => {
  var history = { yes: [], no: [] }
 await Object.entries(users)
       .map(([ index, value ]) => {
        let { id, yes, no } = value

        console.log(id)
        yes.value.forEach((value, index) => {
          value = parseFloat(value)
          if(isNaN(value)) value = 0
          history.yes.push(value)
        })
        no.value.forEach((value, index) => {
          value = parseFloat(value) * -1
          if(isNaN(value)) value = 0
          history.no.push(value)
        })
    })
  return history
}

function Poll(props){
  const [ pollRecords, setRecords ] = useState({ yes: [], no: [] })
  const [ pollCount, setCount ] = useState({ yes: 0, no: 0 })
  const [ pollDescription , setDescription ] = useState("")
  const [ graphState, setGraphState ] = useState(false)
  const [ uniqueAddresses, setUnique ] = useState(0)
  const [ totalPledged, setPledged ] = useState(0)
  const [ pollTopic , setTopic ] = useState("")

  let { state } = useContext(store)
  let { address } = useParams()

  const id = props.location !== undefined ? address : props.id

  useEffect(() => {
    const getMetadata = async() => {
      if(state.polls[id] !== undefined){
        let { title, body, issuer, optionAaddr, optionBaddr } = state.polls[id]
        var pollMetadata = await getPollMetadata(title)

        let { yes, users, no } = pollMetadata
        let records = await getRecords(users)

        console.log(pollMetadata)

        setCount({ yes: parseInt(yes), no: parseInt(no) })
        setRecords({ ...records })
        setDescription(body)
        setGraphState(true)
        setTopic(title)
        }
     }
    getMetadata()
  }, [ props ])

  return(
     <div className="proposalComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <div className="proposal-title">{pollTopic}</div>
            </div>
            <div className="card-body">
              <div className="github-detail">{pollDescription}</div>
              <div className="vote-options">
                <button className="btn btn-primary btn-simple">Yes</button>
                <button className="btn btn-primary btn-simple">No</button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">Results</h3>
            </div>
            <div className="card-body">
              {graphState && (
                <Bar
                  chartId={chartId(id)}
                  yesCount={pollCount.yes}
                  noCount={pollCount.no}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">History</h3>
            </div>
            <div class="card-body">
              {graphState && (
                <Spline
                  chartId={chartId(id)}
                  yesVotes={pollRecords.yes}
                  noVotes={pollRecords.no}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
     </div>
  )
}

export default Poll
