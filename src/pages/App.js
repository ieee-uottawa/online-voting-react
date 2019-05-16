import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './Login';
import Vote from './Vote';
import Header from '../components/Header';

const App = () => (
  <Router>
    <div className="App">
      <Header />

      <Route path="/login" component={Login} />
      <Route path="/vote" component={Vote} />
    </div>
  </Router>
);

export default App;
