import React from 'react';
import { Button } from 'react-bootstrap';
import { NoAuthNavBar } from '../components/NoAuthNavBar';
import { signIn } from '../utils/auth';

function Signin() {
  reretun (
    <>
      <NoAuthNavBar />
      <div className="d-flex flex-wrap">
        {reviewObj.map((review) => (
          <NoAuthReviewCard key={review.firebaseKey} reviewObj={review} />
        ))}
      </div>
    </>
  );
}

export default Signin;
