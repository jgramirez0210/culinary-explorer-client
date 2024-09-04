import React from 'react';
import { Button } from 'react-bootstrap';
import NoAuthNavBar from './NoAuthNavBar';
import { signIn } from '../utils/auth';

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