import React, { Component } from "react";

import Proposals from './assets/components/Proposals';
import Deposits from './assets/components/Deposits';
import NavBar from './assets/components/NavBar';

import "./libraries/black-dashboard/assets/css/black-dashboard-react.css";
import "./libraries/black-dashboard/assets/css/nucleo-icons.css";

import "./assets/css/navigation.css";

import { getProposals } from "./utils/GraphHelper";
import { Container } from "reactstrap";

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
  }

  render() {
    const { proposals } = this.state;

    return (
      <div className="App">
        <NavBar/>
        <Container className='main-container'>
          <Proposals proposals={proposals} />
        </Container>
      </div>
    );
  }
}

export default App;
