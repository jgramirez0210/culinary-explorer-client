import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

export const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: 'culinary-explorer-c7154',
  storageBucket: 'culinary-explorer-c7154.firebasestorage.app',
  messagingSenderId: '867100473167',
  appId: '1:867100473167:web:2f400f413743f054eeb73a',
  measurementId: 'G-QWRQ8L8NQS',
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
};

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
        Accept: 'application/json'
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
        Accept: 'application/json'
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
  initializeFirebase();
  if (auth) {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Sign in successful:', result.user);
        return result;
      })
      .catch((error) => {
        console.error('Sign in error:', error);
        throw error;
      });
  }
};

const signOut = () => {
  initializeFirebase();
  if (auth) {
    firebaseSignOut(auth)
      .then(() => {
        // Force page refresh or redirect
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  }
};

export { signIn, signOut, checkUser, registerUser };

