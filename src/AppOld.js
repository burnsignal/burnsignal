import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

// import "./App.css";
import "./black-dashboard/assets/css/black-dashboard-react.css";
import "./black-dashboard/assets/css/nucleo-icons.css";
import AdminNavbar from "./black-dashboard/components/Navbars/AdminNavbar.jsx";
import { Container, Alert } from "reactstrap";

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    console.log('Constructor...');
    super(props);
    this.addToContract = this.addToContract.bind(this);
  }

  componentDidMount = async () => {
    try {
      console.log('DidMount...');

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];

      if(!deployedNetwork){
        console.log('ooops');
        this.setState({contractError: true});
        return;
      }

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, contractAddress: deployedNetwork.address }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  async addToContract() {
    console.log('Adding...');

    var newStorage = this.state.storageValue + 1;

    const response = await this.state.contract.methods.set(newStorage).send({ from: this.state.accounts[0] });

    this.setState({ storageValue: newStorage });
  }

  render() {

    if(this.state.contractError){
      return <Alert color="danger">No Contract Deployed On Your Current Network - Try Rinkeby?</Alert>;
    }

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <div class="main-panel">
        <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
          <div class="container-fluid">
            <div class="navbar-wrapper">

              <a class="navbar-brand" href="#pablo">Dashboard</a>
            </div>

            <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
              <span class="sr-only">Toggle navigation</span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="#pablo">
                    <i class="tim-icons icon-bell-55"></i>  Notifications
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

      <div class="content">
        <div class="container-fluid">
        <h1>BLK Good to Go!</h1>
          <h3>
            Fancy display heading
            <small className="text-muted">With faded secondary text</small>
          </h3>

          <h2>Smart Contract Example</h2>
          <p>
            Connected to contract at: {this.state.contractAddress}
          </p>

          <h4>The stored value is: {this.state.storageValue}</h4>
        <button type="button" class="btn btn-primary" onClick={this.addToContract}>Primary</button>

      </div>
    </div>
  </div>
      </div>
    );
  }
}

export default App;
