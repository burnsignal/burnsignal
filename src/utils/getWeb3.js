import Web3 from "web3";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "INFURA_ID"
    }
  },
  authereum: {
    package: Authereum,
    options: {}
  }
};

const getWeb3 = () => (
  new Promise(async(resolve, reject) => {
    try {
      const web3Connect = new Web3Connect.Core({
        network: "mainnet",
        cacheProvider: false,
        providerOptions
      })
      const provider = await web3Connect.connect()
      const web3 = new Web3(provider)
      resolve(web3)
    } catch(e){
      resolve(e)
    }
  })
);

export default getWeb3;
