import React, { Fragment, useContext, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import { store } from '../state'
import Proposal from './poll';

function Feed() {
  const [ description, setDescription ] = useState("")
  const [ question, setQuestion ] = useState("")

  let { state } = useContext(store)

  function Create() {
    return(
      <div className="modal fade" id="create" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-left">Create</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body about">
              <CreatePoll />
            </div>
          </div>
        </div>
      </div>
     )
  }

  function CreatePoll() {
    return(
      <Fragment>
        <input onChange={handleQuestion} placeholder="What question is on your mind?" className="create-poll-question" />
        <textarea onChange={handleDescription} placeholder="Description" className="create-poll-description" />
        <button className="btn btn-primary button-poll" onClick={clearValues}> Create </button>
      </Fragment>
    )
  }

  const clearValues = () => {
    document.getElementsByClassName("create-poll-description")[0].value = ""
    document.getElementsByClassName("create-poll-question")[0].value = ""
  }

  const handleDescription = (event) => {
    setDescription(event.target.value)
  }

  const handleQuestion = (event) => {
    setQuestion(event.target.value)
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
          <Proposal key={id} id={id}/>
        </Link>
      ))}
     <Create />
    </Fragment>
  )
}

export default Feed
