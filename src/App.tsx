import React, { Component } from "react";
import Proposals from './components/Proposals';
import Deposits from './components/Deposits';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import "./black-dashboard/assets/css/black-dashboard-react.css";
import "./black-dashboard/assets/css/nucleo-icons.css";
import { getProposals } from "./utils/GraphHelper";


class App extends Component {

  state = { proposals: [], deposits: [] };

  componentDidMount = async () => {
    try {
      // Loads all proposals using the subgraph
      var proposals = await getProposals();
      this.setState({ proposals: proposals });
    } catch (error) {
      alert(
        'Error loading The Graph',
      );
      console.error(error);
    }
  };

  render() {

    return (
      <div className="App">

        <SideBar></SideBar>

        <div className="main-panel">
          <NavBar></NavBar>

          <div className="content">
            <div className="container-fluid">

              <Proposals proposals={this.state.proposals} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
