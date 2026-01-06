import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_DATABASE_URL:', process.env.NEXT_PUBLIC_DATABASE_URL);

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: 'culinary-explorer-c7154',
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
};

console.log('Firebase Credentials:', firebaseCredentials);

// Initialize Firebase only on client-side to avoid SSR issues
let firebaseApp;
let auth;

const initializeFirebase = () => {
  if (typeof window === 'undefined') return; // Skip on server
  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseCredentials) : getApp();
    auth = getAuth(firebaseApp);
  }
};

if (!firebaseCredentials.databaseURL) {
  throw new Error('Firebase databaseURL is not defined in firebaseCredentials');
}

const checkUser = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${firebaseCredentials.databaseURL}/checkuser`, {
      method: 'POST',
      body: JSON.stringify({ uid }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => resolve(resp.json()))
      .catch(reject);
  });

const registerUser = (userInfo) =>
  new Promise((resolve, reject) => {
    fetch(`${firebaseCredentials.databaseURL}/register`, {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });

const signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const signOut = () => {
  firebaseSignOut(auth)
    .then(() => {
      // Force page refresh or redirect
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Sign out error:', error);
    });
};

export { signIn, signOut, checkUser, registerUser };

