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
  let timespan = 22500000;
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

         if(isMinus(value.y) && !isMinus(previous.y)
           || !isMinus(value.y) && isMinus(previous.y)) {
           current = ((running / sum) * 100)
           current = current - ((replacement / sum) * 100)
         } else {
           current = (running / sum) * 100
         } if(isMinus(current)) current = current * -1

         sortedVotes[sortedVotes.length-1] = { x: value.x, y: current }
         totalVotes[x-1] = { x: value.x, y: replacement + highlight }
         totalVotes.splice(x, 1)
       } else {
         current = ((running / sum) * 100)

         if(isMinus(current)) current = current * -1

         sortedVotes.push({ x: value.x,  y: current })
         x++
      }
    } else if(x == 0) {

      sortedVotes.push({ x: value.x,  y: current })
      x++
    }
  }
  return sortedVotes;
}

export const getRecords = async(authenicated, users) => {
  var history = { yes: [], no: [], voters: [] }

  await Object.entries(users).map(async([ index, value ]) => {
    let { address, yes, no } = value

    if(authenicated.indexOf(address) !== -1){
      const positive = await pluckArray(yes, "yes", [])
      const negative = await pluckArray(no, "no", [])

      positive.sort((a,b) => { return a.x - b.x })
      negative.sort((a,b) => { return a.x - b.x })

      Object.assign(history.yes, history.yes.concat(positive))
      Object.assign(history.no, history.no.concat(negative))
      history.voters.push(address)
    }
  })
  return history
}

export const getQuadratics = async(records) => {
  return [
    records.yes.reduce(reducer, 0),
    records.no.reduce(reducer, 0)
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

export const createURL = string => {
  string = string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  string = string.replace(/ /g, '-').toLowerCase();

  if(string.substring(string.length-1, string.length) === "-"){
    string = string.slice(0, string.length-1)
  } return string.replace('?', '');
}
