import { useState, useEffect } from 'react';

const useGoogleMapsScript = (apiKey) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.id = 'googleMaps';
      document.body.appendChild(script);

      script.onload = () => {
        setScriptLoaded(true);
      };
    } else {
      setScriptLoaded(true);
    }
  }, [apiKey]);

  return scriptLoaded;
};

export default useGoogleMapsScript;