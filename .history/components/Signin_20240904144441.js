import React from 'react';
import { Button } from 'react-bootstrap';
import NoAuthNavBar from './NoAuthNavBar';
import { signIn } from '../utils/auth';

function SignIn() {
  return (
    <>
      <NoAuthNavBar />
      <div className="d-flex flex-wrap" />
      <div className="full-width-block">
        <Button type="button" size="lg" className="copy-btn" onClick={signIn}>
          Sign In
        </Button>
      </div>
      <div className="d-flex flex-wrap">
        Before embarking on my software development journey, I worked as a Project Manager in the entertainment industry.
        I enjoyed problem-solving and creating things that people would love. When I discovered software development,
        I was immediately intrigued. I realized that the tech industry would enable me to continue utilizing the skills
        I have honed such as planning, communication, and problem-solving. This sparked my passion for software, which has
        only grown stronger with every discovery.
      </div>
    </>
  );
}

export default SignIn;
