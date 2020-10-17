import React, { Fragment, useState, useEffect } from 'react';

import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'

import { proofErrors } from '../../constants/operatives'

export default function CreatePoll({ account, show, submit, trigger }) {
  const [ component, setComponent ] = useState(<span />)
  const [ d, setDescription ] = useState(null)
  const [ q, setQuestion ] = useState(null)

  const handleDescription = (event) => {
    setDescription(event.target.value)
  }

  const handleQuestion = (event) => {
    setQuestion(event.target.value)
  }

  const submitPoll = async() => {
    let [ title, description ] = [ q, d ]

    if(proofErrors(q, d)) {
      await setDescription(null)
      await setQuestion(null)
      await trigger(true)
      await submit(title, description)
    }
  }

  return (
    <Fragment>
      {!show && (
        <Fragment>
          <div className="poll-profile-hyperlink">
            <Link to={`/profile/${account}`}>
              <img className='new-poll-profile' src={makeBlockie(account)} />
            </Link>
          </div>
          <div className="create-poll-inputs">
            <input value={q} onChange={handleQuestion} name='question' placeholder='Ask a question' className='create-poll-question feed-q' />
            <textarea name='description' value={d} onChange={handleDescription} placeholder='Description' className='create-poll-description feed-d' />
          </div>
          <button className='btn btn-primary button-poll' onClick={submitPoll}> Create </button>
        </Fragment>
      )}
      {show && (
        <div class="pending-state">
          <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status" />
          </div>
          <p class="pending-text"> Pending... </p>
        </div>
      )}
  </Fragment>
 )
}
