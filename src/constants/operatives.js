import { keccak_256, sha3_256 } from 'js-sha3'

export const chartId = str => [...str.substring(0, 10)].reduceRight((res,_,__,arr) => [...res,arr.splice(~~(Math.random()*arr.length),1)[0]],[]).join('');
export const reducer = (accumulator, currentValue) => {
  if(Math.sign(currentValue.y) == -1) currentValue = currentValue.y * -1
  else currentValue = currentValue.y
  return accumulator + currentValue
}

export const isMinus = (value) => Math.sign(value) === -1

export const ETH = wei => {
  if(parseInt(wei) >= 1000000000000000) {
    return `${parseFloat(wei/Math.pow(10,18)).toLocaleString()} ETH`
  } else if(parseInt(wei) >= 1000000){
    return `${parseInt(wei/1000000000).toLocaleString()} GWEI`
  } else if(parseInt(wei) < 1000000) {
    return `${parseInt(wei).toLocaleString()} WEI`
  }
}

export const sortVotes = (yes, no) => {
  let totalVotes = yes.concat(no);
  let timespan = 4800000;
  let sortedVotes = [];
  var x = 0;

  totalVotes.sort((a,b) => { return a.x - b.x })

  while(x < totalVotes.length){
    const value = totalVotes[x]
    const highlight = isMinus(value.y) ? value.y * -1 : value.y
    const array = isMinus(value.y) ? no.slice(0, no.indexOf(value)+1) :
    yes.slice(0, yes.indexOf(value)+1)
    var current = 100

    if(x != 0){
       const sum = totalVotes.slice(0, x+1).reduce(reducer, 0)
       const running = array.reduce(reducer, 0)
       const previous = totalVotes[x-1]

       if((value.x - previous.x) <= timespan){
         var replacement = isMinus(previous.y) ? previous.y * -1 : previous.y

         if(isMinus(value.y) && isMinus(previous.y)){
           current = (running / sum) * -100
         } else if (!isMinus(value.y) && !isMinus(previous.y)){
           current = (running / sum) * 100
         } else if(isMinus(value.y) && !isMinus(previous.y)
           || !isMinus(value.y) && isMinus(previous.y)) {
           current = ((running / sum) * 100)
           current = current - ((replacement / sum) * 100)
         } if(current > 55 && current > 0) current = current - 100
         else if(current < 0 && current < -55) current = current + 100

         sortedVotes[sortedVotes.length-1] = { x: value.x, y: current }
         totalVotes[x-1] = { x: value.x, y: replacement + highlight }
         totalVotes.splice(x, 1)
       } else {
         current = ((running / sum) * 100)

         if(isMinus(value.y)) current = current * -1
         if(current > 55 && current > 0) current = current - 100
         else if(current < 0 && current < -55) current = current + 100

         sortedVotes.push({ x: value.x,  y: current })
         x++
      }
    } else if(x == 0) {
      if(isMinus(value.y)) current = 100 * -1

      sortedVotes.push({ x: value.x,  y: current })
      x++
    }
  }
  return sortedVotes;
}

export const getRecords = async(users) => {
  var history = { yes: [], no: [], voters: [] }

  await Object.entries(users).map(async([ index, value ]) => {
    let { address, yes, no } = value

    const positive = await pluckArray(yes, "yes", [])
    const negative = await pluckArray(no, "no", [])

    positive.sort((a,b) => { return a.x - b.x })
    negative.sort((a,b) => { return a.x - b.x })

    Object.assign(history.yes, history.yes.concat(positive))
    Object.assign(history.no, history.no.concat(negative))
    history.voters.push(address)
  })

  return history
}

export const getQuadratics = (yes, no) => {
  return [
    yes.reduce(reducer, 0),
    no.reduce(reducer, 0)
  ]
}

const pluckArray = (array, sign, rtrn) =>
   new Promise(resolve =>  {
    array.sqrt.forEach((value, index) => {
      const timestamp = array.timestamps[index]
      var coordinate = parseFloat(value)

      if(sign === "no") coordinate = coordinate * -1
      if(isNaN(coordinate)) coordinate = 0

      rtrn.push({
        x: timestamp*1000,
        y: coordinate
      })
    })
   resolve(rtrn)
 })

export const toChecksumAddress = (address) => {
  address = address.toLowerCase().replace('0x', '')
  var hash = keccak_256(address);
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

export const isAddress = (address) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

export const isChecksumAddress = (address) => {
    // Check each case
    address = address.replace('0x','');
    //var addressHash = sha3(address.toLowerCase());
	var addressHash = sha3_256(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};


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

export const createURL = string => {
  string = string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  string = string.replace(/ /g, '-').toLowerCase();

  if(string.substring(string.length-1, string.length) === "-"){
    string = string.slice(0, string.length-1)
  } return string.replace('?', '');
}
