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
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

// Initialize Firebase only on client-side to avoid SSR issues
let firebaseApp;
let auth;

const initializeFirebase = () => {
  if (typeof window === 'undefined') return; // Skip on server
  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseCredentials) : getApp();
    auth = getAuth(firebaseApp);
    console.log('🔍 DEBUG: Firebase initialized successfully');
  }
};

if (!firebaseCredentials.databaseURL) {
  throw new Error('Firebase databaseURL is not defined in firebaseCredentials');
}

const checkUser = (uid) =>
  new Promise((resolve, reject) => {
    const url = `${firebaseCredentials.databaseURL}/checkuser`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ uid }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          console.warn('Backend not available, treating user as new');
          resolve({ valid: false, uid });
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.warn('Backend fetch failed, treating user as new:', error.message);
        console.warn('Full error:', error);
        resolve({ valid: false, uid });
      });
  });

const registerUser = (userInfo) =>
  new Promise((resolve, reject) => {
    const url = `${firebaseCredentials.databaseURL}/register_user`;
    console.log('🔍 DEBUG: Registering user at URL:', url);
    console.log('🔍 DEBUG: User info being sent:', userInfo);
    console.log('🔍 DEBUG: Checking required fields - first_name:', userInfo.first_name, 'last_name:', userInfo.last_name, 'email_address:', userInfo.email_address, 'uid:', userInfo.uid);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => {
        console.log('🔍 DEBUG: Register fetch response status:', resp.status);
        console.log('🔍 DEBUG: Register fetch response headers:', resp.headers);
        if (!resp.ok) {
          console.error('🔍 DEBUG: Register fetch not ok:', resp.statusText);
          console.error('🔍 DEBUG: Register fetch response body will be parsed as JSON');
        }
        return resp.json();
      })
      .then((data) => {
        console.log('🔍 DEBUG: Register successful, data:', data);
        resolve(data);
      })
      .catch((error) => {
        console.error('🔍 DEBUG: Register fetch error:', error.message);
        console.error('🔍 DEBUG: Full error:', error);
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
