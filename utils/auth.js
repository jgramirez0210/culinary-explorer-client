import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

const firebaseApp = !getApps().length ? initializeApp(firebaseCredentials) : getApp();
const auth = getAuth(firebaseApp);

if (!firebaseCredentials.databaseURL) {
  throw new Error('Firebase databaseURL is not defined in firebaseCredentials');
}

const checkUser = (uid) => new Promise((resolve, reject) => {
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

const registerUser = (userInfo) => new Promise((resolve, reject) => {
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
  firebaseSignOut(auth);
};

export {
  signIn,
  signOut,
  checkUser,
  registerUser,
};