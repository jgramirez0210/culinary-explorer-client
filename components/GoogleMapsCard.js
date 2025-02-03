import React, { useState, useEffect } from 'react';
import { loadGoogleMapsAPI } from '../utils/GoogleMapsScripts';
import LocationFetcher from '../utils/googleMapsMarkers';

const GoogleMapsCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadGoogleMapsAPI(
      () => setIsLoaded(true),
      () => setLoadError(true),
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.7604, lng: -95.3698 }, // Houston coordinates
        zoom: 8,
      });

      locations.forEach((location) => {
        new google.maps.Marker({
          position: location,
          map: map,
        });
      });
    }
  }, [isLoaded, locations]);

  return (
    <div>
      <LocationFetcher isLoaded={isLoaded} onLocationsFetched={setLocations} />
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default GoogleMapsCard;
