import React, { Fragment, useState, useEffect } from 'react';

import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'

export default function CreatePoll({ account, show, submit }) {
  const [ component, setComponent ] = useState(<span />)

  function Pending() {
    return (
      <Fragment>
        <div class="pending-state">
          <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status" />
          </div>
          <p class="pending-text"> Pending... </p>
        </div>
      </Fragment>
    )
  }

  function Content() {
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
        await setComponent(<Pending />)
        await submit(title, description)
      }
    }

    const proofErrors = (question, description) => {
      if((question.length < 4
        || question.length > 100)
        || (description.length > 1000)) {
        if(description.length > 1000){
          document.getElementsByClassName('feed-d')[0]
          .style["border-color"] = "#ff0045"
        } if(question.length < 4
          || question.length > 100){
          document.getElementsByClassName('feed-q')[0]
          .style["border-color"] = "#ff0045"
          return false
      }} else {
        if(description.length <= 1000) {
          document.getElementsByClassName('feed-d')[0]
          .style["border-color"] = "#2B3553"
        } if(question.length <= 100
         && question.length >= 4){
          document.getElementsByClassName('feed-q')[0]
          .style["border-color"] = "#2B3553"
        }
        return true;
       }
    }

    return (
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
    )
  }

  useEffect(() => {
    setComponent(<Content />)
  }, [ show ])

  return component
}
