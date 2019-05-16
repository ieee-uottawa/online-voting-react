import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

import Login from './Login';
import Vote from './Vote';
import CanVote from './CanVote';
import Header from '../components/Header';

const useStyles = makeStyles({
  root: {
    padding: '16px 0',
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <>
        <Header />

        <div className={classes.root}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/vote" component={Vote} />
            <Route component={CanVote} />
          </Switch>
        </div>
      </>
    </Router>
  );
};

export default App;
