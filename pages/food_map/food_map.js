// import React, { useEffect, useState } from 'react';
// import { useJsApiLoader } from '@react-google-maps/api';
// import LocationFetcher from '../../utils/googleMapsMarkers';

// const libraries = [];

// const GoogleMapsCard = () => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return <LocationFetcher isLoaded={isLoaded} />;
// };

// export default GoogleMapsCard;

// import React from 'react';
// import LocationFetcher from '../../utils/googleMapsMarkers';

// const GoogleMapsCard = ({  }) => {

//   return (
//     <div>
//       <LocationFetcher isLoaded={isLoaded} />
//     </div>
//   );
// };

// export default GoogleMapsCard;
// NEED TO FIX THIS. LOCATION FETCHER

// import React from 'react';
// import { useJsApiLoader } from '@react-google-maps/api';
// import LocationFetcher from '../../utils/googleMapsMarkers';

// const libraries = [];

// const GoogleMapsCard = () => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <LocationFetcher isLoaded={isLoaded} />
//     </div>
//   );
// };

// export default GoogleMapsCard;

import React, { useEffect, useState, useMemo } from 'react';
import LocationFetcher from '../../utils/googleMapsMarkers';
import { useAuth } from '../../utils/context/authContext';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = [];

const GoogleMapsCard = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && !scriptLoaded) {
      setScriptLoaded(true);
    }
  }, [isLoaded, loadError, scriptLoaded]);

  useEffect(() => {
    if (!isLoaded && !loadError) {
    }
  }, [isLoaded, loadError]);

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded || !scriptLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LocationFetcher isLoaded={isLoaded} />
    </div>
  );
};

export default GoogleMapsCard;
