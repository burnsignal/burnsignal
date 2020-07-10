import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'

import FeedPoll from '../assets/components/feedpoll';
import CreatePoll from '../assets/components/createpoll'
import Alert from '../assets/components/alert'

import { retrievePolls } from '../constants/requests'
import { pollMapping } from '../constants/parameters'
import { store } from '../state'

export default function Feed() {
  const [ pendingState, setPending ] = useState(false)
  const [ posts, setPosts ] = useState(<span/>)

  let { state, dispatch } = useContext(store)

  const createPoll = async(question, description) => {
    let { web3, instance, accounts } = state

    const recentBlock = await web3.eth.getBlock('latest')
    const deadline = recentBlock.timestamp + 605000

    await instance.methods.newVoteProposal(
      question,
      description,
      deadline
    ).send({
      from: accounts[0]
    }).on('confirmation', async(confNum, receipt) => {
      await transactionAlert(receipt)
    }).on('transactionHash', async(hash) => {
      await onHash(hash, question, description)
    })
  }

  const transactionAlert = async(receipt) => {
    await pluckDummy(receipt)
    await setPending(true)

    if(receipt.status == 1) {
      await retrievePolls(dispatch)
    }

    await dispatch({
      payload: { receipt },
      type: 'TX'
    })
  }

  const onHash = (hash, title, description) => {
    let { polls, accounts } = state
    let neophyte = {}

    polls[hash] = {
      ...pollMapping(accounts[0], title, description)
    }

    neophyte = Object.entries(polls).sort((a, b) => {
      return b[1].deadline - a[1].deadline
    })

    polls = {}

    neophyte.forEach(value => polls[value[0]] = value[1])
    dispatchPolls(polls)
  }

  const pluckDummy = (receipt) => {
    let { polls } = state

    delete polls[receipt.transactionHash]

    dispatchPolls(polls)
  }

  const dispatchPolls = (polls) => {
    dispatch({
      payload: { polls },
      type: 'INIT'
    })
  }

  useEffect(() => {
    setPosts(
      Object.keys(state.polls)
        .map((id, index) => (
          <FeedPoll key={id} id={id}/>
      ))
    )
  }, [ state.polls ])

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
                  <CreatePoll
                    account={state.accounts[0]}
                    submit={createPoll}
                    show={pendingState}
                    />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {posts}
    </Fragment>
  )
}
