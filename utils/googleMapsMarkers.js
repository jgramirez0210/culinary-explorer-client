// import React, { useEffect, useState } from 'react';
// import { GoogleMap, AdvancedMarkerElement } from '@react-google-maps/api';
// import { getAllRestaurants } from '../api/Restaurants';
// import { fetchCoordinates } from './GoogleMapsScripts';

// const LocationFetcher = ({ isLoaded }) => {
//   const [locations, setLocations] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const updateLocations = async () => {
//       try {
//         const restaurants = await getAllRestaurants();
//         console.log('Fetched restaurants:', restaurants);

//         const locationPromises = restaurants.map(async (restaurant) => {
//           const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
//           const numericId = Number(id);
//           if (Number.isNaN(numericId)) {
//             console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
//             return null;
//           }
//           try {
//             const location = await fetchCoordinates(restaurantAddress, restaurantName);
//             console.log(`Fetched coordinates for ${restaurantName}:`, location);
//             return {
//               restaurantName,
//               restaurantAddress,
//               location,
//               id: numericId,
//             };
//           } catch (error) {
//             console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
//             return null;
//           }
//         });

//         const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);
//         console.log('Updated locations:', updatedLocations);

//         setLocations(updatedLocations);
//       } catch (error) {
//         console.error('Error updating locations:', error);
//         setError(error);
//       }
//     };

//     if (isLoaded) {
//       updateLocations();
//     }
//   }, [isLoaded]);

//   if (!isLoaded) return <div>Loading...</div>;
//   if (error) return <div>Error loading locations: {error.message}</div>;

//   return (
//     <div style={{ height: '500px', width: '100%' }}>
//       <GoogleMap
//         mapContainerStyle={{ height: '100%', width: '100%' }}
//         center={{ lat: 0, lng: 0 }} // Set a default center
//         zoom={2} // Set a default zoom level
//       >
//         {locations.map(({ location, restaurantName, id }) => (
//           <AdvancedMarkerElement key={id} position={location} title={restaurantName} />
//         ))}
//       </GoogleMap>
//     </div>
//   );
// };

// export default LocationFetcher;
// import React, { useState, useEffect } from 'react';
// import { getAllRestaurants } from '../api/Restaurants';
// import { fetchCoordinates } from './GoogleMapsScripts';
// import Map from '../components/GoogleMapsCard';

// const LocationFetcher = ({ isLoaded }) => {
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const updateLocations = async () => {
//       try {
//         const restaurants = await getAllRestaurants();

//         const locationPromises = restaurants.map(async (restaurant) => {
//           const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
//           const numericId = Number(id);
//           if (Number.isNaN(numericId)) {
//             console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
//             return null;
//           }
//           try {
//             const location = await fetchCoordinates(restaurantAddress, restaurant);
//             return {
//               restaurantName,
//               restaurantAddress,
//               location,
//               id: numericId,
//             };
//           } catch (error) {
//             console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
//             return null;
//           }
//         });

//         const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);
//         setLocations(updatedLocations);
//       } catch (error) {
//         console.error('Failed to fetch restaurant data:', error);
//       }
//     };

//     updateLocations();
//   }, [isLoaded]);

//   if (!isLoaded) {
//     return <div>Loading map...</div>;
//   }

//   return (
//     <div>
//       <Map locations={locations} />
//     </div>
//   );
// };

// export default LocationFetcher;

import React, { useEffect, useState } from 'react';
import { fetchCoordinates } from '../utils/GoogleMapsScripts'; // Ensure correct import
import { getAllRestaurants } from '../api/Restaurants'; // Ensure correct import
import Map from '../components/GoogleMapsCard'; // Ensure correct import

const LocationFetcher = ({ isLoaded }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const updateLocations = async () => {
      try {
        // Fetches all the restaurants
        const restaurants = await getAllRestaurants();
        // Fetches the coordinates of the restaurants
        const locationPromises = restaurants.map(async (restaurant) => {
          // Destructures the restaurant object
          const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
          // Converts the id to a number
          const numericId = Number(id);
          // If the id is not a number, log an error
          if (Number.isNaN(numericId)) {
            console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
            return null;
          }
          // Try to fetch the coordinates
          try {
            const location = await fetchCoordinates(restaurantAddress, numericId);
            console.warn(`Fetched coordinates for ${restaurantName}:`, location); // Pass numericId
            // Return the restaurant name, address, location, and id
            return {
              restaurantName,
              restaurantAddress,
              location,
              id: numericId,
            };
          } catch (error) {
            // Log an error if the coordinates cannot be fetched
            // console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
            return null;
          }
        });

        const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);

        setLocations(updatedLocations);
      } catch (error) {
        console.error('Error updating locations:', error);
      }
    };

    updateLocations();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return <Map locations={locations} />;
};

export default LocationFetcher;
