import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { checkUser } from '../auth.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: 'culinary-explorer-c7154',
  storageBucket: 'culinary-explorer-c7154.firebasestorage.app',
  messagingSenderId: '867100473167',
  appId: '1:867100473167:web:2f400f413743f054eeb73a',
  measurementId: 'G-QWRQ8L8NQS',
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
};

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);

  useEffect(() => {
    if (!getApps().length) {
      initializeApp(firebaseCredentials);
    }
    const auth = getAuth();
    onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setOAuthUser(fbUser);
        checkUser(fbUser.uid).then((userInfo) => {
          let userObj = {};
          if ('null' in userInfo) {
            userObj = userInfo;
          } else {
            userObj = { fbUser, uid: fbUser.uid, ...userInfo };
          }
          setUser(userObj);
        });
      } else {
        setOAuthUser(false);
        setUser(false);
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser: setUser,
      userLoading: user === null || oAuthUser === null,
    }),
    [user, oAuthUser]
  );

  return <AuthContext.Provider value={value} {...props} />;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, AuthContext, useAuth };
