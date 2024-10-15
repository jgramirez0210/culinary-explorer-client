// // MapComponent.js
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { getAllRestaurants } from './api'; // Adjust the import based on your project structure

// const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

// const center = {
//   lat: 29.749907,
//   lng: -95.358421
// };

// /**
//  * Fetches coordinates for a given address using Google Maps Geocoding API.
//  * @param {string} address - The address to geocode.
//  * @returns {Promise<{lat: number, lng: number}>} - The latitude and longitude.
//  */
// const fetchCoordinates = async (address) => {
//   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
//   const data = await response.json();
//   const { lat, lng } = data.results[0].geometry.location;
//   return { lat, lng };
// };

// const MapComponent = () => {
//   const [googleMaps, setGoogleMaps] = useState(null);
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     const updateLocations = async () => {
//       const restaurants = await getAllRestaurants(); // Fetch restaurant data from local server
//       const updatedLocations = [];

//       for (const restaurant of restaurants) {
//         const { name, address } = restaurant;
//         const location = await fetchCoordinates(address);
//         updatedLocations.push({ key: name.toLowerCase().replace(/\s+/g, ''), location });
//       }

//       setLocations(updatedLocations);
//     };

//     updateLocations();
//   }, []);

//   const onLoad = (map) => {
//     setGoogleMaps(window.google);
//   };

//   return (
//     <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//       <GoogleMap
//         mapContainerStyle={{ width: '100vw', height: '100vh' }}
//         center={center}
//         zoom={12}
//         onLoad={onLoad}
//       >
//         {googleMaps && locations.map((location) => (
//           <Marker
//             key={location.key}
//             position={location.location}
//             icon={{
//               path: googleMaps.maps.SymbolPath.CIRCLE,
//               fillColor: '#FBBC04',
//               fillOpacity: 1,
//               strokeColor: '#000',
//               strokeWeight: 2,
//               scale: 7
//             }}
//           />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default React.memo(MapComponent);

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getAllRestaurants } from './Restaurants';

const API_KEY = 'process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

const center = {
  lat: 29.749907,
  lng: -95.358421
};

const fetchCoordinates = async (address) => {
  try {
    console.log(`Fetching coordinates for address: ${address}`);
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      // console.log(`Coordinates for address ${address}: Latitude: ${lat}, Longitude: ${lng}`);
      return { lat, lng };
    } else {
      console.warn(`No results found for address: ${address}`);
      throw new Error(`No results found for address: ${address}`);
    }
  } catch (error) {
    console.error(`Error fetching coordinates for address: ${address}`, error);
    throw error;
  }
};

const fetchDishesForRestaurant = async (restaurant) => {
  const { restaurant_name, restaurant_address } = restaurant;
  console.warn(`Fetching dishes for ${restaurant_name} at address: ${restaurant_address}`);
  try {
    const response = await fetch(`https://your-api-endpoint.com/dishes?address=${encodeURIComponent(restaurant_address)}`);
    const data = await response.json();
    
    if (data.dishes && data.dishes.length > 0) {
      console.warn(`Dishes for ${restaurant_name}:`, data.dishes);
      return data.dishes;
    } else {
      console.warn(`No dishes found for ${restaurant_name} at address: ${restaurant_address}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching dishes for ${restaurant_name} at address: ${restaurant_address}`, error);
    throw error;
  }
};

const MapComponent = () => {
  const [googleMaps, setGoogleMaps] = useState(null);
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const updateLocations = async () => {
      try {
        const restaurants = await getAllRestaurants(); // Fetch restaurant data from local server
        console.warn('restaurants:', restaurants);
        const updatedLocations = [];

        for (const restaurant of restaurants) {
          const { restaurant_name, restaurant_address } = restaurant;
          try {
            const location = await fetchCoordinates(restaurant_address);
            updatedLocations.push({ key: restaurant_name.toLowerCase().replace(/\s+/g, ''), name: restaurant_name, address: restaurant_address, location });
          } catch (error) {
            console.error(`Failed to fetch coordinates for ${restaurant_name} with address: ${restaurant_address}`, error);
            // Retry with a simplified address
            try {
              const simplifiedAddress = restaurant_address.split(',')[0]; // Use only the first part of the address
              const location = await fetchCoordinates(simplifiedAddress);
              updatedLocations.push({ key: restaurant_name.toLowerCase().replace(/\s+/g, ''), name: restaurant_name, address: restaurant_address, location });
            } catch (retryError) {
              console.error(`Retry failed for ${restaurant_name} with simplified address: ${simplifiedAddress}`, retryError);
            }
          }
        }

        setLocations(updatedLocations);
      } catch (error) {
        console.error('Failed to update locations', error);
      }
    };

    updateLocations();
  }, []);

  const onLoad = (map) => {
    setGoogleMaps(window.google);
  };

  const handleMarkerMouseOver = (marker) => {
    setActiveMarker(marker);
  };

  const handleMarkerMouseOut = () => {
    setActiveMarker(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '800px' }}
        center={center}
        zoom={10}
        onLoad={onLoad}
      >
        {locations.map((poi) => (
          <Marker
            key={poi.key}
            position={poi.location}
            title={poi.name}
            onMouseOver={() => handleMarkerMouseOver(poi)}
            onMouseOut={handleMarkerMouseOut}
          >
            {activeMarker === poi && (
              <InfoWindow position={poi.location} onCloseClick={handleMarkerMouseOut}>
                <div>
                  <h3>{poi.name}</h3>
                  <p>{poi.address}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;