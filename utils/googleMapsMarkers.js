// import React, { useState, useEffect } from 'react';
// import { getAllRestaurants } from '../api/Restaurants';
// import { fetchCoordinates } from './GoogleMapsScripts';
// import Map from '../components/GoogleMapsCard';
// Fetch Locations for Map
/**
 * Fetches and updates the locations of restaurants using Google Maps API.
 * @returns {JSX.Element} The map component displaying the locations.
 */
/**
 * Fetches and displays locations on a map.
 *
 * @returns {JSX.Element} The LocationFetcher component.
//  */
// const LocationFetcher = (isLoaded) => {

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

// components/LocationFetcher.js

// import React, { useState, useEffect } from 'react';
// import { useJsApiLoader } from '@react-google-maps/api';
// import { getAllRestaurants } from '../api/Restaurants';
// import { fetchCoordinates } from './GoogleMapsScripts';
// import Map from '../components/GoogleMapsCard';

// const LocationFetcher = () => {
//   const [locations, setLocations] = useState([]);
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//   });

//   useEffect(() => {
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
//         console.error('Error updating locations:', error);
//       }
//     };

//     updateLocations();
//   }, []);

//   if (!isLoaded) return <div>Loading...</div>;

//   return <Map locations={locations} />;
// };

// export default LocationFetcher;
// utils/googleMapsMarkers.js
import { useEffect, useState } from 'react';

export const fetchCoordinates = async (address) => {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
  const data = await response.json();
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
};

export const getAllRestaurants = async () => {
  const response = await fetch('/api/restaurants'); // Replace with your actual API endpoint
  const data = await response.json();
  return data.restaurants; // Assuming the API returns a list of restaurants
};

const LocationFetcher = ({ isLoaded, onLocationsFetched }) => {
  useEffect(() => {
    const fetchLocations = async () => {
      const restaurants = await getAllRestaurants();
      const locations = await Promise.all(
        restaurants.map(async (restaurant) => {
          const coordinates = await fetchCoordinates(restaurant.address);
          return { ...restaurant, coordinates };
        }),
      );
      onLocationsFetched(locations);
    };

    if (isLoaded) {
      fetchLocations();
    }
  }, [isLoaded, onLocationsFetched]);

  return null;
};

export default LocationFetcher;
