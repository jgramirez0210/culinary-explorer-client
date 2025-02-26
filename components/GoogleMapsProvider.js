import { useJsApiLoader } from '@react-google-maps/api';
import { createContext, useContext } from 'react';

// Define libraries array as a constant outside the component
const libraries = ['marker', 'places'];

export const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    loading: 'async',
  });

  return <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>{children}</GoogleMapsContext.Provider>;
}
