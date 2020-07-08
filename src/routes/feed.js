import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'

import FeedPoll from '../assets/components/feedpoll';

import { getPolls, getETHPrice } from '../constants/calls/GraphQL'
import { getAuthenicated } from '../constants/calls/REST'
import { store } from '../state'

function Feed() {
  const description = useRef(null)
  const question = useRef(null)

  let { state, dispatch } = useContext(store)

  function CreatePoll() {
    return(
      <Fragment>
        <div className="create-poll-inputs">
          <input ref={question} name='question' placeholder='Ask a question' className='create-poll-question feed-q' />
          <textarea name='description' ref={description} placeholder='Description' className='create-poll-description feed-d' />
        </div>
        <button className='btn btn-primary button-poll' onClick={createPoll}> Create </button>
      </Fragment>
    )
  }

  const clearValues = () => {
    document.getElementsByClassName('feed-d')[0].value = ''
    document.getElementsByClassName('feed-q')[0].value = ''
  }

  const proofErrors = (question, description) => {
    if((question.current.value.length < 4
      || question.current.value.length > 100)
      || (description.current.value.length > 1000)) {
      if(description.current.value.length > 1000){
        document.getElementsByClassName('feed-d')[0]
        .style["border-color"] = "#ff0045"
      } if(question.current.value.length < 4
        || question.current.value.length > 100){
        document.getElementsByClassName('feed-q')[0]
        .style["border-color"] = "#ff0045"
    }} else {
      if(description.current.value.length <= 1000) {
        document.getElementsByClassName('feed-d')[0]
        .style["border-color"] = "#2B3553"
      } if(question.current.value.length <= 100
       && question.current.value.length >= 4){
        document.getElementsByClassName('feed-q')[0]
        .style["border-color"] = "#2B3553"
      }
    }
  }

  const createPoll = async() => {
    let { web3, instance, accounts } = state
    if(question.current.value.length >= 4
      && question.current.value.length <= 100
      && description.current.value.length <= 1000){
      const recentBlock = await web3.eth.getBlock('latest')
      const deadline = recentBlock.timestamp + 605000

      proofErrors(question, description)

      await instance.methods.newVoteProposal(
        question.current.value,
        description.current.value,
        deadline
      ).send({
        from: accounts[0]
      }).on('transactionHash', async(hash) => {
        await retrievePolls()
        clearValues()
      })
    } else {
      proofErrors(question, description)
    }
  }

  const retrievePolls = async() => {
    var authenicated = await getAuthenicated()
    var price = await getETHPrice()
    var polls = await getPolls()

    dispatch({
      payload: {
        authenicated, polls, price
      },
      type: 'INIT'
    })
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Burn Signal</title>
        <meta property='og:title' content='Burn Signal' />
        <meta property='og:description' content='Got an opinion? Burn ETH to prove it.' />
        <meta property='twitter:title' content='Burn Signal' />
        <meta property='twitter:description' content='Got an opinion? Burn ETH to prove it.' />
      </MetaTags>
      {state.web3 && (
        <div className='new-poll'>
          <Row>
            <Col sm='12' md={{ size: 6, offset: 3 }}>
              <div className='card'>
                <div className='card-header' />
                <div className='card-body'>
                  <div className="poll-profile-hyperlink">
                    <Link to={`/profile/${state.accounts[0]}`}>
                      <img className='new-poll-profile' src={makeBlockie(state.accounts[0])} />
                    </Link>
                  </div>
                  <CreatePoll />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {Object.keys(state.polls)
        .map((id, index) => (
        <FeedPoll key={id} id={id}/>
      ))}
    </Fragment>
  )
}

export default Feed
