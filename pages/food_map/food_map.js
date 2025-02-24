// import React, { useEffect, useState, useMemo } from 'react';
// import LocationFetcher from '../../utils/googleMapsMarkers';
// import { useAuth } from '../../utils/context/authContext';
// import { useJsApiLoader } from '@react-google-maps/api';

// const libraries = [];

// const GoogleMapsCard = () => {
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   useEffect(() => {
//     if (isLoaded && !scriptLoaded) {
//       setScriptLoaded(true);
//     }
//   }, [isLoaded, loadError, scriptLoaded]);

//   useEffect(() => {
//     if (!isLoaded && !loadError) {
//     }
//   }, [isLoaded, loadError]);

//   if (loadError) {
//     return <div>Error loading Google Maps script</div>;
//   }

//   if (!isLoaded || !scriptLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <LocationFetcher isLoaded={isLoaded} />
//     </div>
//   );
// };

// export default GoogleMapsCard;

// food_map.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/context/authContext';
import GoogleMapsCard from '../../components/GoogleMapsCard';
import { getFoodLogByUser } from '../../api/FoodLog';

const FoodMap = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.warn('FoodMap: Fetching restaurants for user:', user.uid);
      getFoodLogByUser(user.uid)
        .then((data) => {
          console.warn('FoodMap: Successfully fetched restaurants:', data);
          setRestaurants(data);
        })
        .catch((error) => {
          console.warn('FoodMap: Error fetching restaurants:', error);
          setRestaurants([]);
        });
    }
  }, [user]);

  return <GoogleMapsCard currentUser={user} restaurants={restaurants} />;
};

export default FoodMap;
