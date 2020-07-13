import { getPolls, getETHPrice } from './calls/GraphQL'
import { getAuthenicated } from './calls/REST'

import { pollMapping } from './parameters'

export const retrievePolls = (dispatch) => {
  return new Promise(async(resolve) => {
    var authenicated = await getAuthenicated()
    var price = await getETHPrice()
    var polls = await getPolls()

    dispatch({
      payload: {
        authenicated, polls, price
      },
      type: 'INIT'
    }, resolve())
  })
}

export const onHash = (state, dispatch, hash, title, description) => {
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

  dispatch({
    payload: { polls },
    type: 'INIT'
  })
}
