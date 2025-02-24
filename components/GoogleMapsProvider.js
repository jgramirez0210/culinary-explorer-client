import { useEffect, createContext, useContext, useState } from 'react';

export const GoogleMapsContext = createContext({
  isLoaded: false,
  setIsLoaded: () => {},
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

const SCRIPT_ID = 'google-maps-script';

export function GoogleMapsProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      // If script exists but not loaded, wait for it
      existingScript.addEventListener('load', () => {
        setIsLoaded(true);
      });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      setIsLoaded(true);
    });

    document.head.appendChild(script);

    return () => {
      // Only remove the script if we're not in development
      if (process.env.NODE_ENV !== 'development') {
        const scriptToRemove = document.getElementById(SCRIPT_ID);
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      }
    };
  }, []);

  return <GoogleMapsContext.Provider value={{ isLoaded, setIsLoaded }}>{children}</GoogleMapsContext.Provider>;
}
