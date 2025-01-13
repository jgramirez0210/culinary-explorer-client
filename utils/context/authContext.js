// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import { checkUser } from '../auth.js';
// import firebase from 'firebase/app';

// const AuthContext = createContext();

// AuthContext.displayName = 'AuthContext';

// const AuthProvider = (props) => {
//   const [user, setUser] = useState(null);
//   const [oAuthUser, setOAuthUser] = useState(null);

//   const updateUser = useMemo(
//     () => (uid) => checkUser(uid).then((userInfo) => {
//       setUser({ fbUser: oAuthUser, ...userInfo });
//     }),
//     [oAuthUser],
//   );

//   useEffect(() => {
//     firebase.auth().onAuthStateChanged((fbUser) => {
//       if (fbUser) {
//         setOAuthUser(fbUser);
//         checkUser(fbUser.uid).then((userInfo) => {
//           let userObj = {};
//           if ('null' in userInfo) {
//             userObj = userInfo;
//           } else {
//             userObj = { fbUser, uid: fbUser.uid, ...userInfo };
//           }
//           setUser(userObj);
//         });
//       } else {
//         setOAuthUser(false);
//         setUser(false);
//       }
//     });
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       updateUser,
//       userLoading: user === null || oAuthUser === null,
//     }),
//     [user, oAuthUser, updateUser],
//   );

//   return <AuthContext.Provider value={value} {...props} />;
// };

// export { AuthProvider, AuthContext };

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { checkUser } from '../auth.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);

  const updateUser = useMemo(
    () => (uid) => checkUser(uid).then((userInfo) => {
      setUser({ fbUser: oAuthUser, ...userInfo });
    }),
    [oAuthUser],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
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

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
      userLoading: user === null || oAuthUser === null,
    }),
    [user, oAuthUser, updateUser],
  );

  return <AuthContext.Provider value={value} {...props} />;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
