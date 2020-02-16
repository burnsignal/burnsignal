const QUERY_POLL = poll => `{ polls(where: { id: "${poll}" }) { yes no users { address yes { contributions timestamps total value sqrt } no { contributions timestamps total value sqrt } } } }`
const QUERY_ISSUES = `{ issues(where: { title_not_contains: "question" }) { id poll body title issuer deadline optionBaddr optionAaddr } }`
const QUERY_ISSUE = title => `{ issues(where: { title: "${title}" }) { poll } }`
const BURN_SUBGRAPH_ENDPOINT = "https://api.thegraph.com/subgraphs/name/burnsignal/proof-of-concept"
const QUERY_USER = user => `{ user(id: "${user.toLowerCase()}") { burns polls burned } }`

const requestHeaders = body => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }, body: JSON.stringify({
    query: body
  })
})

const makeRequest = async(query) => {
  return await fetch(BURN_SUBGRAPH_ENDPOINT,
    { ...requestHeaders(query)})
    .then(response =>
      response.json())
    .then(data => data)
    .catch(console.log)
}

export async function getPolls() {
  const result = await makeRequest(QUERY_ISSUES)
  const routeObject = {}

  result.data.issues.forEach(obj => {
    routeObject[obj.poll] = { ...obj }
  }); return routeObject;
}

export async function getPollAddress(issueName){
  const result = await makeRequest(QUERY_ISSUE(issueName))
  if(result.data.issues.length == 0){
    return { id: "" }
  } else return result.data.issues[0].poll
}

export async function getPollMetadata(pollName){
  const result = await makeRequest(QUERY_POLL(pollName))
  if(result.data.polls.length == 0){
    return { yes: 0, no: 0, users: [] }
  } else return result.data.polls[0]
}

export async function getProfileMetadata(profileAddress){
  const result = await makeRequest(QUERY_USER(profileAddress))
  if(result.data.user === null){
    return { burned: 0, polls: [], burns: [] }
  } else return result.data.user
}
