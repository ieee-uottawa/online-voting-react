import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/styles';

import logo from './uottawa_branch_logo-1.png';

const useStyles = makeStyles({
  root: {
    padding: '32px 0',
  },
  link: {
    flexGrow: 1,
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="sticky" className={classes.root}>
      <Toolbar>
        <a href="https://ieeeuottawa.ca" className={classes.link}>
          <img
            src={logo}
            alt="IEEE uOttawa Logo"
            style={{
              maxHeight: 60,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          />
        </a>
      </Toolbar>
    </AppBar>
  );
}
