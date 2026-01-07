import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { checkUser, firebaseCredentials } from '../auth.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const AuthProvider = (props) => {
  console.log('AuthProvider rendering, isServer:', typeof window === 'undefined');
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);

  useEffect(() => {
    console.log('AuthProvider useEffect running, isServer:', typeof window === 'undefined');
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
      userLoading: user === null || oAuthUser === null
    }),
    [user, oAuthUser]
  );

  return <AuthContext.Provider value={value} {...props} />;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, AuthContext, useAuth };
