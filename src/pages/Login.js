import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login/index';
import Typography from '@material-ui/core/Typography';

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
      <GoogleLogin
        autoLoad
        clientId="1081480094053-t8ii15jeout0pedl3riq55suvnu4hhub.apps.googleusercontent.com"
        buttonText="Login"
        hostedDomain="uottawa.ca"
        onSuccess={loginResponse}
        onFailure={loginResponse}
      />
    );
  }

  if (!isValidEmail) {
    return (
      <div>
        <h3>Sorry, {name}! {email} is an invalid email, please sign in with your uOttawa email.</h3>
        <button>Okay</button>
      </div>
    );
  }

  return <Redirect to="/vote" />;
}

export default Login;
