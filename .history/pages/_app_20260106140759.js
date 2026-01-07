/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import ClientSideAuthProvider from '../components/ClientSideAuthProvider';
import { GoogleMapsProvider } from '../components/GoogleMapsProvider';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';

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
