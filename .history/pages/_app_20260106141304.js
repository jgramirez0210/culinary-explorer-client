'use client';

/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import dynamic from 'next/dynamic';
import ClientSideAuthProvider from '../components/ClientSideAuthProvider';

// Dynamically import GoogleMapsProvider to prevent SSR issues
const GoogleMapsProvider = dynamic(() => import('../components/GoogleMapsProvider').then(mod => mod.GoogleMapsProvider), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const ViewDirectorBasedOnUserAuthStatus = dynamic(() => import('../utils/ViewDirector').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

function MyApp({ Component, pageProps }) {
  return (
    <GoogleMapsProvider>
      <ClientSideAuthProvider>
        {' '}
        {/* gives children components access to user and auth methods */}
        <ViewDirectorBasedOnUserAuthStatus
          // if status is pending === loading
          // if status is logged in === view app
          // if status is logged out === sign in page
          component={Component}
          pageProps={pageProps}
        />
      </ClientSideAuthProvider>
    </GoogleMapsProvider>
  );
}

export default MyApp;
