const BRIGHTID_ENDPOINT = "http://node.brightid.org/brightid/v3/verifications/ethereum"

export async function getAuthenicated() {
  return await fetch(BRIGHTID_ENDPOINT,
    {  method: 'GET' })
    .then(response =>
      response.json())
    .then(result =>
      result.data.contextIds)
    .catch(console.log)
}
