import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Authereum from 'authereum';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '1a3489db693d46ceb5ef9006f5ada61f'
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
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: false,
        providerOptions
      })
      web3Modal.clearCachedProvider()

      const provider = await web3Modal.connect()
      let web3 = new Web3(provider)

      resolve(web3)
    } catch(e){
      resolve(e)
    }
  })
);

export default getWeb3;
