import React from 'react';
import { Button, Image } from 'react-bootstrap';
import NoAuthNavBar from './NoAuthNavBar';
import { signIn } from '../utils/auth';
import creatorProfileImage from '../\assets\creator_profile_image.JPG';

function SignIn() {
  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  return (
    <>
      <NoAuthNavBar />
      <div className="d-flex flex-wrap" />
      <div className="full-width-block">Welcome to Culinary Explorer! The best way to keep track of your dining experiences.</div>
      <div className="about-the-site-label">ABOUT THE SITE</div>
      <div className="about-the-site">Dining out can become a complex and often stressful experience for people with dietary restrictions, such as allergies or intolerances. That is where Culinary Explorer steps in, it creates a single spot where you can log the different restaurants you&apos;ve eaten at and your experience.</div>
      <div className="about-the-site-label">ABOUT THE CREATOR</div>
      <div className="profile-container">
        <Image src={creatorProfileImage} alt="Creator Profile" className="creator-profile-image" />
      </div>
      <div className="about-the-site">Before embarking on my software development journey, I worked as a Project Manager in the entertainment industry. I enjoyed problem-solving and creating things that people would love. When I discovered software development, I was immediately intrigued. I realized that the tech industry would enable me to continue utilizing the skills I have honed such as planning, communication, and problem-solving. This sparked my passion for software, which has only grown stronger with every discovery.</div>
      <div className="button-container">
        <Button type="button" size="lg" className="copy-btn" onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    </>
  );
}

export default SignIn;
