export const chartId = str => [...str.substring(0, 10)].reduceRight((res,_,__,arr) => [...res,arr.splice(~~(Math.random()*arr.length),1)[0]],[]).join('');

export const sortVotes = (_yesVotes, _noVotes) => {
  let totalVotes = _yesVotes.concat(_noVotes);

  totalVotes.sort((a,b) => { return a - b });
  totalVotes.unshift(0);

  return totalVotes;
}

export const getRecords = async(users) => {
  var history = { yes: [], no: [], voters: [] }
 await Object.entries(users)
       .map(([ index, value ]) => {
        let { address, yes, no } = value

        history.voters.push(address)
        yes.value.forEach((value, index) => {
          value = parseFloat(value)
          if(isNaN(value)) value = 0
          history.yes.push(value)
        })
        no.value.forEach((value, index) => {
          value = parseFloat(value) * -1
          if(isNaN(value)) value = 0
          history.no.push(value)
        })
    })
  return history
}

export const createURL = string => {
  string = string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  string = string.replace(/ /g, '-').toLowerCase();

  if(string.substring(string.length-1, string.length) === "-"){
    string = string.slice(0, string.length-1)
  } return string.replace('?', '');
}

// Code to process vote info. Should be easy to replace.
// This is where BrightID check will be added.

export async function getVoteInfo(proposalData){
  var anonymousDeposits = proposalData.data.anonymousDeposits;
  var noDeposits = anonymousDeposits.length;
  var voters = {};
  var totalValue = 0;

  // Check all the deposits for proposal
  for(var i = 0;i < noDeposits;i++){

    var yesValue = 0, noValue = 0;

    // Add BrightID check. Don't count vote if not.??

    if(anonymousDeposits[i].Choice === 'yes'){
      yesValue = parseFloat(anonymousDeposits[i].ContriValue);
    } else {
      noValue = parseFloat(anonymousDeposits[i].ContriValue);
    }

    // Check if address has already been counted & initialise if not
    if(voters[anonymousDeposits[i].SenderAddr] === undefined){
      voters[anonymousDeposits[i].SenderAddr] = { yesTotalValue: yesValue, noTotalValue: noValue };
    }else{
      var newYesValue = voters[anonymousDeposits[i].SenderAddr].yesTotalValue + yesValue;
      var newNoValue = voters[anonymousDeposits[i].SenderAddr].noTotalValue + noValue;
      voters[anonymousDeposits[i].SenderAddr] = { yesTotalValue: newYesValue, noTotalValue: newNoValue };
    }

    totalValue += parseFloat(anonymousDeposits[i].ContriValue);
  }

  return { voters: voters, totalValue: totalValue}
}

export async function getQuadraticTotals(voters){
  // Quadratic method.
  // Calculate quadratic total for each voter
  var yes = 0;
  var no = 0;
  var noUniqueAdresses = 0;
  var totalValue = 0;
  for(var key in voters){
    // skip loop if the property is from prototype
    if (!voters.hasOwnProperty(key)) continue;

    var voter = voters[key];
    yes += Math.sqrt(voter.yesTotalValue);
    no += Math.sqrt(voter.noTotalValue);
    noUniqueAdresses += 1;
    totalValue = totalValue + voter.yesTotalValue + voter.noTotalValue;
  }
  return {
    yesCount: yes,
    noCount: no,
    noUniqueAdresses: noUniqueAdresses,
    totalValue: totalValue
  };
}
