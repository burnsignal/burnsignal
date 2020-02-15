import React, { Fragment, useContext, useState, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import { store } from '../state'
import Poll from './poll';

function Feed() {
  const [ description, setDescription ] = useState("")
  const [ question, setQuestion ] = useState("")
  const [ focus, setFocus ] = useState({ })

  let { state } = useContext(store)

  const handleDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleQuestion = (e) => {
    setQuestion(e.target.value)
  }

  const triggerFocus = (e) => {
    setFocus({ [e.target.name]: true })
  }

  const leaveFocus = (e) => {
    setFocus({ [e.target.name]: false })
  }

  function CreatePoll() {
    return(
      <Fragment>
        <input autoFocus={focus.question} onMouseEnter={triggerFocus} onMouseLeave={leaveFocus} name="question" value={question} onChange={handleQuestion} placeholder="What question is on your mind?" className="create-poll-question" />
        <textarea autoFocus={focus.description} name="description" onMouseEnter={triggerFocus} onMouseLeave={leaveFocus} value={description} onChange={handleDescription} placeholder="Description" className="create-poll-description" />
        <button className="btn btn-primary button-poll" onClick={createPoll}> Create </button>
      </Fragment>
    )
  }

  const clearValues = () => {
    document.getElementsByClassName("create-poll-description")[0].value = ""
    document.getElementsByClassName("create-poll-question")[0].value = ""
  }

  const createPoll = async() => {
    let { web3, instance, accounts } = state

    const recentBlock = await web3.eth.getBlock("latest")
    const deadline = recentBlock.timestamp + 604800

    await instance.methods.newVoteProposal(question,
      description,
      deadline
    ).send({
      from: accounts[0]
    }).on('transactionHash', (hash) => {
      clearValues()
    })
  }

  return (
    <Fragment>
      {state.web3 && (
        <div className="new-poll">
          <Row>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <div className="card">
                <div className="card-header" />
                <div className="card-body">
                  <Link to={`/profile/${state.accounts[0]}`}>
                    <img className="new-poll-profile" src={makeBlockie(state.accounts[0])} />
                  </Link>
                  <CreatePoll />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {Object.keys(state.polls).reverse().map((id, index) => (
        <Link to={`/poll/${id}`}>
          <Poll key={id} id={id}/>
        </Link>
      ))}
    </Fragment>
  )
}

export default Feed
