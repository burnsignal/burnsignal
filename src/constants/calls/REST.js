import { toChecksumAddress } from '../operatives'

const BRIGHTID_ENDPOINT = 'https://sp.brightid.org/node/v4/verifications/ethereum'

export async function getAuthenicated() {
  var authenicated = await fetch(BRIGHTID_ENDPOINT,
    {  method: 'GET' })
    .then(response =>
      response.json())
    .then(result =>
      result.data.contextIds)
    .catch(console.log)

  await authenicated.forEach((address, i) =>
    authenicated[i] = toChecksumAddress(address)
  )

  return authenicated
}
