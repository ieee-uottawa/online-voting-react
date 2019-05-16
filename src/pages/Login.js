import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import request from '../network';

function Login() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  async function loginResponse({ tokenId, profileObj }) {
    if (tokenId) {
      const { name, email } = profileObj;
      const { ok, unauthorized, text: token } = await request
        .post('/users/verify')
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
      }
    }
  }

  if (!isSignedIn) {
    return (
      <>
        <Typography variant="h6">
          <strong>
            We take voter anonymity seriously. We make you log in to your uOttawa account to track that you have voted but we can never trace back to
            who you voted for.
          </strong>
        </Typography>
        <GoogleLogin
          clientId="911039919657-o235c8rl1qr59hlnr2djoiuivqbqmib2.apps.googleusercontent.com"
          buttonText="Login"
          hostedDomain="uottawa.ca"
          onSuccess={loginResponse}
          onFailure={loginResponse}
        />
      </>
    );
  }

  if (!isValidEmail) {
    return (
      <>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <Typography variant="h5">Sorry, {name}! {email} is an invalid email, please sign in with your uOttawa email.</Typography>
        <Button variant="contained">Okay</Button>
      </>
    );
  }

  return <Redirect to="/vote" />;
}

export default Login;
