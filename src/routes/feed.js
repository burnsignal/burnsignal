import React, { Fragment, useContext, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Row, Col } from "reactstrap"

import { store } from '../state'
import Proposal from './poll';

function Feed() {
  let { state } = useContext(store)

  return (
    <Fragment>
      {state.web3 && (
        <div className="new-poll">
          <Row>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <div className="card">
                <div className="card-header" />
                <div className="card-body">
                  <img className="new-poll-profile" src={makeBlockie(state.accounts[0])} />
                  <textarea placeholder="What question is on your mind?" className="create-poll-field" />
                  <button className="btn btn-primary button-poll"> Create </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {Object.keys(state.polls).map((id, index) => (
        <Link to={`/poll/${id}`}>
          <Proposal key={id} id={id}/>
        </Link>
      ))}
    </Fragment>
  )
}

export default Feed
