import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'

import FeedPoll from '../assets/components/feedpoll';
import CreatePoll from '../assets/components/createpoll'
import Alert from '../assets/components/alert'

import { onHash, retrievePolls } from '../constants/requests'
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
    }).on('transactionHash', async(hash) => {
      await onHash(state, dispatch, hash, question, description)
    }).on('confirmation', async(confNum, receipt) => {
      await transactionAlert(receipt, true)
    }).catch(async(data) => {
     await transactionAlert({
        status: 2
      }, false)
    })
  }

  const transactionAlert = async(receipt, broadcast) => {
    await setPending(false)

    if(receipt.status == 1) await retrievePolls(dispatch)
    if(broadcast) await pluckDummy(receipt)

    await dispatch({
      payload: { ...receipt },
      type: 'TX'
    })
  }

  const pluckDummy = (receipt) => {
    let { polls } = state

    delete polls[receipt.transactionHash]

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
                    trigger={setPending}
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
