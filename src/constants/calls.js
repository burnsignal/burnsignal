const API_KEY = "5HPMW9M7DTMYBGP9IXR2M8JNUGEM2HNNDI";

const CALL = (_address) => (`http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${_address}&page=1&offset=0&sort=asc&apikey=${API_KEY}`);

export async function getTransactions(_address, _type) {
  let burnTransactions  = [];

  await fetch(CALL(_address), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }).then(response => {
    return response.json()
  }).then(data => {
      data.result.forEach(tx => {
        if(parseFloat(tx.value) > 0){
          burnTransactions.push(
            !_type ? (-1) * parseFloat(tx.value) : parseFloat(tx.value),
          );
        }
      });
  }); return burnTransactions;
}
