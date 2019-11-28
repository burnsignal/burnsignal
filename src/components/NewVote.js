import React, { Component } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import getWeb3 from "../utils/getWeb3";

class NewVote extends Component {
  // Allows user to create a new Proposal/Question/Vote/Whatever it's agreed to be called.
  // Uses hardcoded contract address.
  // Deadline not currently functioning.
  state = { web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);

    this.makeNewVote = this.makeNewVote.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.updateDeadline = this.updateDeadline.bind(this);
  }

  componentDidMount = async () => {
    try {
      console.log('Loading web3...');
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();


      let address = '0x6936b81d7629378aabddcf882b2a7fdfff1cd962';  // Taken from old repo, assume this is the Ropstein deployed

      const instance = new web3.eth.Contract(abi, address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

    } catch (error) {
      alert(
        'Error loading The Graph',
      );
      console.error(error);
    }
  };

  async makeNewVote(){
    console.log('New Vote');
    console.log(this.state.question);
    console.log(this.state.deadline);
    console.log('Sending transaction...');
    await this.state.contract.methods.newVoteProposal(this.state.question,'Here is some data', (Date.now() + 3600*1000)).send({ from: this.state.accounts[0] });
    console.log('Done?')
  }

  updateQuestion(event) {
    this.setState({question: event.target.value});
  }

  updateDeadline(event) {
    this.setState({deadline: event.target.value});
  }

  render() {
    return(

      <div className="App">

        <SideBar></SideBar>

        <div className="main-panel">
          <NavBar></NavBar>

            <div className="content">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="title">Ask a question...</h5>
                    </div>
                    <div className="card-body">
                      <form>

                        <div className="row">
                          <div className="col-md-12 pr-md-1">
                            <div className="form-group">
                              <label>Your Question</label>
                              <input type="text" className="form-control" placeholder="Ask Away" onChange={this.updateQuestion}/>
                            </div>
                          </div>

                        </div>
                        <div className="row">
                          <div className="col-md-12 pr-md-1">
                            <div className="form-group">
                              <label>Deadline</label>
                              <input type="text" className="form-control" placeholder="Block No"  onChange={this.updateDeadline}/>
                            </div>
                          </div>
                        </div>

                      </form>
                    </div>
                    <div className="card-footer">
                      <button type="submit" className="btn btn-fill btn-primary" onClick={this.makeNewVote}>Post</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

        </div>
      </div>

    )

  }
}

export default NewVote;

var abi = [
  {
   "constant": false,
   "inputs": [
    {
     "name": "_name",
     "type": "string"
    },
    {
     "name": "_data",
     "type": "string"
    },
    {
     "name": "_deadline",
     "type": "uint64"
    }
   ],
   "name": "newVoteProposal",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "proposalID",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "issuer",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "deadline",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "name",
     "type": "string"
    },
    {
     "indexed": false,
     "name": "data",
     "type": "string"
    }
   ],
   "name": "newProposalIssued",
   "type": "event"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "proposals",
   "outputs": [
    {
     "name": "issuer",
     "type": "address"
    },
    {
     "name": "deadline",
     "type": "uint256"
    },
    {
     "name": "name",
     "type": "string"
    },
    {
     "name": "data",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  }
 ]
