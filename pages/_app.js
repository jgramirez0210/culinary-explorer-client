/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { AuthProvider } from '../utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';
import { GoogleMapsProvider } from '../components/GoogleMapsProvider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <ViewDirectorBasedOnUserAuthStatus component={Component} pageProps={pageProps} />
      </GoogleMapsProvider>
    </AuthProvider>
  );
}

export default MyApp;
