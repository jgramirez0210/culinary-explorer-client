import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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