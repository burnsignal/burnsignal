export const chartId = str => [...str.substring(0, 10)].reduceRight((res,_,__,arr) => [...res,arr.splice(~~(Math.random()*arr.length),1)[0]],[]).join('');

export const sortVotes = (_yesVotes, _noVotes) => {
  let totalVotes = _yesVotes.concat(_noVotes);

  totalVotes.sort((a,b) => { return a - b });
  totalVotes.unshift(0);

  console.log(totalVotes)

  return totalVotes;
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
