import { getPolls, getETHPrice } from './calls/GraphQL'
import { getAuthenicated } from './calls/REST'

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
