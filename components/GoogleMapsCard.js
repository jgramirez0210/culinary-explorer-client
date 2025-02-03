// components/GoogleMapsCard.js
// import React, { useEffect, useState } from 'react';
// import { loadGoogleMapsScript } from '../utils/GoogleMapsScripts';
// import LocationFetcher from '../utils/googleMapsMarkers';

// const GoogleMapsCard = ({ locations }) => {
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(false);
//   const [fetchedLocations, setFetchedLocations] = useState([]);

//   useEffect(() => {
//     let isMounted = true;

//     loadGoogleMapsScript()
//       .then(() => {
//         if (isMounted) setScriptLoaded(true);
//       })
//       .catch(() => {
//         if (isMounted) setLoadError(true);
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   if (loadError) {
//     return <div>Error loading Google Maps script</div>;
//   }

//   if (!scriptLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <LocationFetcher isLoaded={isLoaded} onLocationsFetched={handleLocationsFetched} />
//       <Map locations={locations} />
//     </div>
//   );
// };

// export default GoogleMapsCard;

// In your main component file where you load the Google Maps API
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

  const handleLocationsFetched = (fetchedLocations) => {
    setLocations(fetchedLocations);
  };

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LocationFetcher isLoaded={isLoaded} onLocationsFetched={handleLocationsFetched} />
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default GoogleMapsCard;
