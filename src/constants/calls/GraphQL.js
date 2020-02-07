const QUERY_POLL = poll => `{ polls(where: { id: "${poll}" }) { yes no users { id yes { contributions timestamps total value sqrt } no { contributions timestamps total value sqrt } } } }`
const QUERY_ISSUES = `{ issues(where: { title_not_contains: "fae" }) { id body title issuer deadline optionBaddr optionAaddr } }`
const BURN_SUBGRAPH_ENDPOINT = "https://api.thegraph.com/subgraphs/name/burnsignal/proof-of-concept"

const createURL = string => {
  string = string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  string = string.replace(/ /g, '-').toLowerCase();

  if(string.substring(string.length-1, string.length) === "-"){
    string = string.slice(0, string.length-1)
  } return string.replace('?', '');
}

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
    routeObject[createURL(obj.title)] = { ...obj }
  }); return routeObject;
}

export async function getPollMetadata(pollName){
  const result = await makeRequest(QUERY_POLL(pollName))
  if(result.data.polls.length == 0){
    return { yes: 0, no: 0, users: [] }
  } else return result.data.polls[0]
}
