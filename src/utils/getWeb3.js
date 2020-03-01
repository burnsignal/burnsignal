import Web3 from "web3";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "ec7ebabd867b43d0a2cf6d65a85b8ad1"
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
        network: "rinkeby",
        cacheProvider: false,
        providerOptions
      })
      web3Connect.clearCachedProvider()

      const provider = await web3Connect.connect()
      let web3

      if(provider.authereum) web3 = new Web3(provider.authereum)
      else web3 = new Web3(provider)

      resolve(web3)
    } catch(e){
      resolve(e)
    }
  })
);

export default getWeb3;
