const QUERY_POLL = poll => `{ polls(where: { id: "${poll}" }) { yes no users { address yes { contributions timestamps total value sqrt } no { contributions timestamps total value sqrt } } } }`
const QUERY_ISSUES = `{ issues(where: { title_not_contains: "question" }) { id poll body title issuer deadline optionBaddr optionAaddr } }`
const QUERY_ISSUE = title => `{ issues(where: { title: "${title}" }) { poll } }`
const QUERY_USER = user => `{ user(id: "${user.toLowerCase()}") { burns polls burned } }`
const QUERY_USD = `{ exchanges(where: { id:"0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667"}) { price } } `

const BURNGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/burnsignal/proof-of-concept'
const UNISWAP_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'

const requestHeaders = body => ({
  method: 'POST',
  body: JSON.stringify({
    query: body
  })
})

const makeRequest = async(query, endpoint) => {
  return await fetch(endpoint,
    { ...requestHeaders(query)})
    .then(response =>
      response.json())
    .then(data => data)
    .catch(console.log)
}

export async function getPolls() {
  let result = await makeRequest(QUERY_ISSUES, BURNGRAPH_ENDPOINT)
  const routeObject = {}

  result.data.issues.sort((a, b) => { return b.deadline - a.deadline })
  result.data.issues.forEach(obj => {
    routeObject[obj.poll] = { ...obj }
  }); return routeObject;
}

export async function getPollAddress(issueName){
  const result = await makeRequest(QUERY_ISSUE(issueName), BURNGRAPH_ENDPOINT)
  if(result.data.issues.length == 0){
    return { id: "" }
  } else return result.data.issues[0].poll
}

export async function getPollMetadata(pollName){
  const result = await makeRequest(QUERY_POLL(pollName), BURNGRAPH_ENDPOINT)

  console.log(result.data)

  if(result.data != undefined) return result.data.polls[0]
  else return { yes: 0, no: 0, users: [] }

}

export async function getProfileMetadata(profileAddress){
  const result = await makeRequest(QUERY_USER(profileAddress), BURNGRAPH_ENDPOINT)
  if(result.data.user === null){
    return { burned: 0, polls: [], burns: [] }
  } else return result.data.user
}

export async function getETHPrice() {
  const result = await makeRequest(QUERY_USD, UNISWAP_ENDPOINT)
  console.log(result)
  return result.data.exchanges[0].price;
}
