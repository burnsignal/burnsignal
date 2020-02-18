const ETH_CALL = "https://api.coinmarketcap.com/v1/ticker/ethereum/"

export const getETHPrice = async() => {
  return await fetch(ETH_CALL, {
    method: 'GET',
  }).then(response => response.json())
  .then(data => data)
  .catch(console.log)
}
