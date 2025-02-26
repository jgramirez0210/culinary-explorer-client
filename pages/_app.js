/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { AuthProvider } from '../utils/context/authContext';
import { GoogleMapsProvider } from '../components/GoogleMapsProvider';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <NavBar />
        <Component {...pageProps} />
      </GoogleMapsProvider>
    </AuthProvider>
  );
}

export default MyApp;
