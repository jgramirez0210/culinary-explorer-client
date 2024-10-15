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
import DishListByRestaurant from '../components/DishListByRestaurant';

const API_KEY = 'process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

const center = {
  lat: 29.749907,
  lng: -95.358421,
};

const fetchCoordinates = async (address) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error(`No results found for address: ${address}`);
    }
  } catch (error) {
    console.error(`Error fetching coordinates for address: ${address}`, error);
    throw error;
  }
};

const MapComponent = (poi) => {
  const [googleMaps, setGoogleMaps] = useState(null);
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const updateLocations = async () => {
      try {
        const restaurants = await getAllRestaurants();
        const updatedLocations = [];

        for (const restaurant of restaurants) {
          const { restaurant_name, restaurant_address, id } = restaurant;
          try {
            const location = await fetchCoordinates(restaurant_address);
            updatedLocations.push({ key: `${restaurant_name.toLowerCase().replace(/\s+/g, '')}-${id}`, restaurant_name, restaurant_address, location, id });
          } catch (error) {
            console.error(`Failed to fetch coordinates for ${restaurant_name} with address: ${restaurant_address}`, error);
            let simplifiedAddress;
            try {
              simplifiedAddress = simplifyAddress(restaurant_address);
              const location = await fetchCoordinates(simplifiedAddress);
              updatedLocations.push({ key: `${restaurant_name.toLowerCase().replace(/\s+/g, '')}-${id}`, restaurant_name, simplifiedAddress, location, id });
            } catch (retryError) {
              console.error(`Retry failed to fetch coordinates for ${restaurant_name} with simplified address: ${simplifiedAddress}`, retryError);
            }
          }
        }

        setLocations(updatedLocations);
      } catch (error) {
        console.error('Failed to update locations:', error);
      }
    };

    updateLocations();
  }, []);

  const onLoad = (map) => {
    setGoogleMaps(window.google);
  };

  const handleMarkerMouseOver = (marker, poi) => {
    setActiveMarker(marker, poi);
  };

  const handleMarkerMouseOut = () => {
    setActiveMarker(null);
  };

  // const getRestaurantId = (poi) => {
  //   console.log('POI object:', poi); // Log the entire poi object for debugging
  //   const id = poi.id; // Use the correct property
  //   console.log(`Checking restaurant ID: ${id}`); // Add this line for debugging
  //   if (isNaN(Number(id))) {
  //     console.error(`Invalid restaurant ID: ${id}`);
  //     return null;
  //   }
  //   console.warn('Restaurant ID:', id);
  //   return Number(id);
  // };
  const getRestaurantId = (poi) => {
    try {
      if (!poi || typeof poi.id === 'undefined') {
        console.error('POI does not contain an ID:', poi);
        return null;
      }
      return Number(poi.id);
    } catch (error) {
      console.error('Error fetching restaurant ID:', error);
      return null;
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
        {locations.map((poi) => (
          // console.warn('Rendering marker:', poi),
          <Marker key={poi.key} position={poi.location} title={poi.restaurant_name} onMouseOver={() => handleMarkerMouseOver(poi)} onMouseOut={handleMarkerMouseOut}>
            {activeMarker === poi && (
              <InfoWindow position={poi.location} onCloseClick={handleMarkerMouseOut}>
                <div>
                  <h3>{poi.restaurant_name}</h3>
                  <p>{poi.address}</p>
                  {/* {poi.id && console.warn('POI id:', poi.id)} */}
                  {getRestaurantId(poi) && <DishListByRestaurant restaurantId={getRestaurantId(poi)} />}
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
