import React, { useState, useEffect } from 'react';
import { loadGoogleMapsAPI } from '../utils/GoogleMapsScripts';
import LocationFetcher from '../utils/googleMapsMarkers';

const GoogleMapsCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    try {
      loadGoogleMapsAPI(
        () => setIsLoaded(true),
        () => setLoadError(true),
      );
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 29.7604, lng: -95.3698 }, // Houston coordinates
          zoom: 8,
        });

        if (locations && locations.length > 0) {
          locations.forEach((location) => {
            if (location && location.lat && location.lng) {
              new google.maps.Marker({
                position: location,
                map: map,
              });
            }
          });
        }
      } catch (error) {
        console.error('Error rendering map:', error);
      }
    }
  }, [isLoaded, locations]);

  if (loadError) {
    return <div>Error loading map</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <LocationFetcher isLoaded={isLoaded} onLocationsFetched={setLocations} />
      <div id="map" style={{ height: '100vh', width: '100vw', position: 'absolute' }}></div>
    </div>
  );
};

export default GoogleMapsCard;
