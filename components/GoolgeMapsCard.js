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
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { getAllRestaurants } from '../api/Restaurants';
import fetchCoordinates from '../api/GoogleMapsApi';
import DishListByRestaurant from './DishListByRestaurant';

const center = {
  lat: 29.749907,
  lng: -95.358421,
};

const getRestaurantId = (poi) => {
  try {
    if (!poi?.id) {
      console.error('POI object or id property is missing:', poi);
      return null;
    }
    const id = Number(poi.id);
    if (Number.isNaN(id)) {
      console.error('POI ID is not a valid number:', poi.id);
      return null;
    }
    return id;
  } catch (error) {
    console.error('Error fetching restaurant ID:', error);
    return null;
  }
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const updateLocations = async () => {
      try {
        const restaurants = await getAllRestaurants();

        const locationPromises = restaurants.map(async (restaurant) => {
          const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
          const numericId = Number(id);
          if (Number.isNaN(numericId)) {
            console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
            return null;
          }
          try {
            const location = await fetchCoordinates(restaurantAddress);
            return {
              restaurantName,
              restaurantAddress,
              location,
              id: numericId,
            };
          } catch (error) {
            console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
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

  const handleMarkerMouseOver = (poi) => {
    setActiveMarker(poi); // Open only one InfoWindow by setting the active marker
  };

  const handleInfoWindowCloseClick = () => {
    setActiveMarker(null); // Close the InfoWindow on clicking the 'x'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
        {locations.map((poi) => {
          const restaurantId = getRestaurantId(poi);
          const isRestaurantIdValid = !Number.isNaN(Number(restaurantId));

          return (
            <Marker key={restaurantId} position={poi.location} title={poi.restaurant_name} onMouseOver={() => handleMarkerMouseOver(poi)}>
              {activeMarker === poi && (
                <InfoWindow position={poi.location} onCloseClick={handleInfoWindowCloseClick}>
                  <div>
                    <h3>{poi.restaurantName}</h3>
                    <p>{poi.restaurantAddress}</p>
                    {isRestaurantIdValid ? <DishListByRestaurant restaurantId={restaurantId} /> : <p>Error: Invalid restaurant ID</p>}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
