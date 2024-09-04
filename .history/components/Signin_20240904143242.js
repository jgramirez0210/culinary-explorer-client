import React, { useEffect } from 'react';
import NoAuthNavBar from './NoAuthNavBar';

function Signin() {
  return (
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
