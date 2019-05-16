import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

import request from '../network';

const useStyles = makeStyles({
  root: {
    padding: '0 16px',
  },
});

function Login() {
  const [canVote, setCanVote] = useState(true);
  const [canVoteBody, setCanVoteBody] = useState(undefined);
  const [isSignedIn, setSignedIn] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  async function loginResponse({ tokenId, profileObj }) {
    if (tokenId) {
      const { name, email } = profileObj;
      const {
        ok, unauthorized, status, text: token, body,
      } = await request
        .post('/users/verify')
        .ok(res => res.status < 500)
        .set('Authorization', `Bearer ${tokenId}`)
        .send({ email });
      if (ok) {
        setSignedIn(true);
        setIsValidEmail(true);
        localStorage.setItem('token', token);
      } else if (unauthorized) {
        setSignedIn(true);
        setIsValidEmail(false);
        setName(name);
        setEmail(email);
      } else if (status === 412) {
        setCanVoteBody(body);
        setCanVote(false);
      }
    }
  }

  const classes = useStyles();

  if (!canVote) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: canVoteBody,
        }}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <div className={classes.root}>
        <Typography variant="h6">
          We take voter anonymity seriously. We make you log in to your uOttawa account to track that you have voted but
          {' '}
          <strong>we can never trace back to who you voted for.</strong>
        </Typography>
        <GoogleLogin
          clientId="911039919657-o235c8rl1qr59hlnr2djoiuivqbqmib2.apps.googleusercontent.com"
          buttonText="Login"
          hostedDomain="uottawa.ca"
          onSuccess={loginResponse}
          onFailure={loginResponse}
        />
      </div>
    );
  }

  if (!isValidEmail) {
    return (
      <div className={classes.root}>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <Typography variant="h5">Sorry, {name}! {email} is an invalid email, please sign in with your uOttawa email.</Typography>
        <Button variant="contained">Okay</Button>
      </div>
    );
  }

  return <Redirect to="/vote" />;
}

export default Login;
