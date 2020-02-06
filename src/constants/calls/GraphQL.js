// Code to retrieve info from The Graph. Should make easier to change to TypeScript.
// Exisiting subgraph at: https://thegraph.com/explorer/subgraph/madhur4444/imgovdynamic
// https://api.thegraph.com/subgraphs/name/madhur4444/imgovdynamic
// Useful docs: https://thegraph.com/docs/graphql-api

const createURL = string => {
  string = string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  string = string.replace(/ /g, '-').toLowerCase();

  if(string.substring(string.length-1, string.length) === "-"){
    string = string.slice(0, string.length-1)
  } return string.replace('?', '');
}

export async function getProposals() {
  // Gets all issued proposals
  // Currently name_not_contains: "fae" to avoid old proposals with unrealistic votes.
  console.log('TheGraph - getProposals()');
  const query = `{
    newProposalIssueds(where: { name_not_contains: "fae" }) {
      id
      issuer
      deadline
      name
      data
      optionBaddr
      optionAaddr
    }
  }`;

  const result = await fetch('https://api.thegraph.com/subgraphs/name/madhur4444/imgovdynamic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  }).then(r => r.json()).then(data => data).catch(error => console.log(error))
  console.log('TheGraph - got Proposals.');

  const indexedObject = {}

  result.data.newProposalIssueds.forEach(obj => {
    indexedObject[createURL(obj.name)] = { ...obj }
  });

  return indexedObject;
};

export async function getProposalData(ProposalName){
  // Get information for specific Proposal identified by name.
  console.log('GetProposalData(): ' + ProposalName)

  // Gets all deposits for this proposal
  const query = `{ anonymousDeposits (where: {PropName: "` + ProposalName + `"}) {
      id
      SenderAddr
      ContriValue
      PropName
      Choice
    }
  }`;

  const result = await fetch('https://api.thegraph.com/subgraphs/name/madhur4444/imgovdynamic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  }).then(r => r.json()).then(data => data).catch(error => console.log(error))

  return result;
}

export async function getQuadraticTotals(ProposalName){

  const query = `{ QuadraticTotals (where: {proposal: "` + ProposalName + `"}) {
      proposal
      appprove
      decline
      total
    }
  }`;

  const result = await fetch('https://api.thegraph.com/subgraphs/name/madhur4444/imgovdynamic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  }).then(r => r.json()).then(data => data).catch(error => console.log(error))

  return result;
}
