import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

function Login() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [name] = useState('');
  const [email] = useState('');

  async function loginResponse({ tokenId }) {
    // eslint-disable-next-line quote-props
    if (tokenId) {
      const { status } = await axios.post('http://localhost:8080/users/verify', null, { headers: { Authorization: `Bearer ${tokenId}` } });
      if (status === 200) {
        setSignedIn(true);
        setIsValidEmail(true);
      } else if (status === 401) {
        setSignedIn(true);
        setIsValidEmail(false);
      }
      console.log(status);
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

  return (
    <Redirect to="/vote" />
  );
}

export default Login;
