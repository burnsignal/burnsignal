import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Proposal from './assets/components/Proposal';
import NewVote from './assets/components/NewVote';
import App from './App';

import * as serviceWorker from './serviceWorker';
import { HashRouter, Route } from 'react-router-dom'
import { getProposals } from "./utils/GraphHelper";

const Profile = ({match}) => (
  <div>
    <h2>Profile For Address: {match.params.address}</h2>
  </div>
)

class Index extends Component {
  state = { proposals: [] }

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
    return(
     <HashRouter basename='/'>
       <Fragment>
         <main>
           <Route path="/profile/:address" component={Profile} />
           <Route path="/poll/:address" component={Proposal} />
           <Route path="/new" component={NewVote} />
           <Route exact path="/" component={App} />
         </main>
       </Fragment>
     </HashRouter>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
serviceWorker.unregister();
