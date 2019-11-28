import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import NewVote from './components/NewVote';
import * as serviceWorker from './serviceWorker';
import { HashRouter, Route } from 'react-router-dom'


const Profile = ({match}) => (
  <div>
    <h2>Profile For Address: {match.params.address}</h2>
  </div>
)

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <HashRouter basename='/'>
      <div>
        <main>
          <Route exact path="/" component={App} />
          <Route path="/home" component={App} />
          <Route path="/newVote" component={NewVote} />
          <Route exact path="/profile/:address" component={Profile} />
        </main>
      </div>
  </HashRouter>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
