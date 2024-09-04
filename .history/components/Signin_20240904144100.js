import React from 'react';
import NoAuthNavBar from './NoAuthNavBar';
import { Button } from 'react-bootstrap'; // Ensure you import Button if using react-bootstrap
import { signIn } from '../utils/auth'; // Ensure you import the signIn function

function Signin() {
  return (
    <>
      <NoAuthNavBar />
      <div className="d-flex flex-wrap" />
      <div className="full-width-block">
        <Button type="button" size="lg" className="copy-btn" onClick={signIn}>
          Sign In
        </Button>
      </div>
      <div className="d-flex flex-wrap" />
    </>
  );
}

export default Signin;