import React, { useEffect, useState } from 'react';
import LocationFetcher from '../../utils/googleMapsMarkers';
import { loadGoogleMapsScript } from '../../utils/GoogleMapsScripts';

const GoogleMapsCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      libraries: [], // No libraries needed for this load
      language: 'en',
      region: 'US',
    }).then(() => {
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <LocationFetcher isLoaded={isLoaded} />;
};

export default GoogleMapsCard;
