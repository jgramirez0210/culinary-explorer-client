// // GoogleMapsCard.jsx (or .js)
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { createRoot } from 'react-dom/client';
// import { GoogleMapsLoader } from '../utils/GoogleMapsLoader';
// import { fetchCoordinates } from '../utils/GoogleMapsScripts';
// import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';

// const HOUSTON_CENTER = {
//   lat: 29.7589382,
//   lng: -95.3676974,
// };

// const GoogleMapsCard = ({ currentUser, restaurants }) => {
//   const [map, setMap] = useState(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [locationError, setLocationError] = useState('');
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [userLocation, setUserLocation] = useState(HOUSTON_CENTER);
//   const [locations, setLocations] = useState([]);
//   const [activeOverlay, setActiveOverlay] = useState(null);
//   const [userMarker, setUserMarker] = useState(null);

//   const createUserMarker = useCallback(async (position, currentMap) => {
//     if (!window.google?.maps) return null;

//     const userLocationGlyph = document.createElement('div');
//     userLocationGlyph.className = 'user-location-glyph new-class';

//     try {
//       const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
//       return new AdvancedMarkerElement({
//         position,
//         map: currentMap,
//         title: 'Your Location',
//         content: userLocationGlyph,
//       });
//     } catch (error) {
//       console.error('Error creating marker:', error);
//       return null;
//     }
//   }, []);

//   const initMap = useCallback(async () => {
//     try {
//       const mapElement = document.getElementById('map');
//       if (!mapElement || !window.google?.maps) {
//         return;
//       }

//       const newMap = new window.google.maps.Map(mapElement, {
//         center: userLocation,
//         zoom: 15,
//         gestureHandling: 'cooperative',
//         fullscreenControl: true,
//         mapTypeControl: true,
//         zoomControl: true,
//         mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
//       });

//       // Create initial user location marker
//       const marker = await createUserMarker(userLocation, newMap);
//       setUserMarker(marker);
//       setMap(newMap);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       setLoadError(true);
//       setErrorMessage('Failed to load Google Maps');
//     }
//   }, [userLocation, createUserMarker]);

//   const getCurrentLocation = useCallback(async () => {
//     if (!map || !window.google?.maps) return;

//     const useHoustonLocation = () => {
//       setUserLocation(HOUSTON_CENTER);
//       setLocationError('Using default Houston location.');
//       if (map) {
//         map.panTo(HOUSTON_CENTER);
//         map.setZoom(11);
//       }
//     };

//     setIsGettingLocation(true);
//     setLocationError('');

//     try {
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject, {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0,
//         });
//       });

//       const userPos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       setUserLocation(userPos);
//       setLocationError('');

//       // Update map position
//       map.panTo(userPos);
//       map.setZoom(13);

//       // Update marker position
//       if (userMarker) {
//         userMarker.position = userPos;
//       } else {
//         const newMarker = await createUserMarker(userPos, map);
//         setUserMarker(newMarker);
//       }
//     } catch (error) {
//       console.error('Browser geolocation failed:', error);
//       useHoustonLocation();
//     } finally {
//       setIsGettingLocation(false);
//     }
//   }, [map, userMarker, createUserMarker]);

//   // Initialize map when Google Maps script is loaded
//   useEffect(() => {
//     if (window.google?.maps && !map) {
//       initMap();
//     }
//   }, [initMap, map]);

//   // Handle script load
//   const handleScriptLoad = useCallback(() => {
//     console.log('Google Maps script loaded');
//     if (!map) {
//       initMap();
//     }
//   }, [initMap, map]);

//   // Handle restaurant data
//   useEffect(() => {
//     if (!restaurants || !Array.isArray(restaurants)) {
//       setLocations([]);
//       return;
//     }

//     const processRestaurants = async () => {
//       const formattedLocations = await Promise.all(
//         restaurants.map(async (restaurant) => {
//           // If we already have coordinates, use them
//           if (restaurant.latitude != null && restaurant.longitude != null) {
//             return {
//               restaurant_name: restaurant.restaurant?.restaurant_name,
//               restaurant_address: restaurant.restaurant?.restaurant_address,
//               coords: {
//                 lat: restaurant.latitude,
//                 lng: restaurant.longitude,
//               },
//             };
//           }
//           // If we have coords object, use it
//           if (restaurant.coords?.lat != null && restaurant.coords?.lng != null) {
//             return {
//               restaurant_name: restaurant.restaurant?.restaurant_name,
//               restaurant_address: restaurant.restaurant?.restaurant_address,
//               rating: restaurant.rating,
//               coords: restaurant.coords,
//             };
//           }

//           // Try to fetch coordinates using the existing function
//           const coords = await fetchCoordinates(restaurant.restaurant?.restaurant_address, restaurant.restaurant?.id);

//           if (!coords) {
//             return null;
//           }

//           return {
//             restaurant_name: restaurant.restaurant?.restaurant_name,
//             restaurant_address: restaurant.restaurant?.restaurant_address,
//             rating: restaurant.rating,
//             coords,
//           };
//         }),
//       );

//       // Filter out null values and set locations
//       const validLocations = formattedLocations.filter(Boolean);
//       setLocations(validLocations);
//     };

//     processRestaurants();
//   }, [restaurants]);

//   useEffect(() => {
//     const createMarkers = async () => {
//       if (!map || !locations.length || !isLoaded) {
//         return;
//       }

//       // Clear existing markers
//       if (window.currentMarkers) {
//         window.currentMarkers.forEach((marker) => {
//           marker.setMap(null);
//         });
//       }
//       window.currentMarkers = [];

//       for (const loc of locations) {
//         if (!loc.coords?.lat || !loc.coords?.lng) {
//           continue;
//         }

//         const coords = {
//           lat: parseFloat(loc.coords.lat),
//           lng: parseFloat(loc.coords.lng),
//         };

//         const restaurantPin = document.createElement('div');
//         restaurantPin.className = 'restaurant-pin';
//         const innerPin = document.createElement('div');
//         innerPin.className = 'restaurant-pin-inner';
//         restaurantPin.appendChild(innerPin);

//         try {
//           const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
//           const marker = new AdvancedMarkerElement({
//             position: coords,
//             map: map,
//             title: loc.restaurant_name,
//             content: restaurantPin,
//           });

//           window.currentMarkers.push(marker);

//           marker.addListener('click', () => {
//             console.warn('Current User ID:', currentUser?.uid);
//             console.warn('Restaurant clicked:', loc.restaurant_name);

//             if (activeOverlay) {
//               activeOverlay.setMap(null);
//             }

//             const hoverCard = new google.maps.OverlayView();
//             hoverCard.onAdd = function () {
//               const hoverCardDiv = document.createElement('div');
//               hoverCardDiv.className = 'hover-card';
//               const root = createRoot(hoverCardDiv);
//               root.render(
//                 <GoogleMapsHoverCard
//                   poi={{
//                     location: {
//                       lat: coords.lat,
//                       lng: coords.lng,
//                     },
//                     restaurantName: loc.restaurant_name,
//                     restaurantAddress: loc.restaurant_address,
//                   }}
//                   restaurantId={loc.restaurant_id}
//                   onClose={() => {
//                     hoverCard.setMap(null);
//                   }}
//                 />
//               );
//               const panes = this.getPanes();
//               if (panes && panes.floatPane) {
//                 panes.floatPane.appendChild(hoverCardDiv);
//               }
//             };
//             hoverCard.draw = function () {
//               const projection = this.getProjection();
//               const position = projection.fromLatLngToDivPixel(new google.maps.LatLng(coords.lat, coords.lng));
//               const hoverCardDiv = this.getPanes().floatPane.querySelector('.hover-card');
//               hoverCardDiv.style.left = position.x + 'px';
//               hoverCardDiv.style.top = position.y + 'px';
//             };
//             hoverCard.onRemove = function () {
//               const panes = this.getPanes();
//               if (panes && panes.floatPane) {
//                 const hoverCardDiv = panes.floatPane.querySelector('.hover-card');
//                 if (hoverCardDiv) {
//                   hoverCardDiv.parentNode.removeChild(hoverCardDiv);
//                 }
//               }
//             };
//             hoverCard.setMap(map);

//             setActiveOverlay(hoverCard);
//           });
//         } catch (error) {
//           console.error('Error creating marker:', error);
//         }
//       }
//     };

//     createMarkers();
//   }, [map, locations, activeOverlay, isLoaded]);

//   return (
//     <>
//       <GoogleMapsLoader
//         onLoad={handleScriptLoad}
//         onError={(e) => {
//           console.error('Error loading Google Maps script:', e);
//           setLoadError(true);
//           setErrorMessage('Failed to load Google Maps');
//         }}
//       />
//       <div className="map-container" id="map">
//         {locationError && (
//           <div
//             className="alert alert-warning"
//             role="alert"
//             style={{
//               position: 'absolute',
//               top: '10px',
//               left: '50%',
//               transform: 'translateX(-50%)',
//               zIndex: 1,
//               backgroundColor: 'rgba(255, 243, 205, 0.9)',
//               padding: '10px 20px',
//               borderRadius: '4px',
//               maxWidth: '80%',
//               textAlign: 'center',
//             }}
//           >
//             {locationError}
//           </div>
//         )}
//         {loadError ? (
//           <div className="alert alert-danger" role="alert">
//             {errorMessage}
//           </div>
//         ) : (
//           <div id="map" className="map">
//             <button
//               onClick={getCurrentLocation}
//               disabled={isGettingLocation}
//               style={{
//                 position: 'absolute',
//                 top: '10px',
//                 right: '10px',
//                 zIndex: 1,
//                 padding: '8px 16px',
//                 backgroundColor: '#4285F4',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: isGettingLocation ? 'wait' : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//               }}
//             >
//               {isGettingLocation ? 'Getting Location...' : 'Get My Location'}
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default GoogleMapsCard;

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';

const center = { lat: 29.749907, lng: -95.358421 };

/**
 * Renders a Google Map component with markers and info windows.
 *
 * @param {Object[]} locations - An array of locations to be displayed as markers on the map.
 * @returns {JSX.Element} The rendered Google Map component.
 */
const MapComponent = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleInfoWindowCloseClick = () => {
    setSelectedLocation(null);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
      {locations.map((poi) => {
        const restaurantId = poi.id;

        return <Marker key={restaurantId} position={poi.location} title={poi.restaurantName} onClick={() => handleMarkerClick(poi)} />;
      })}
      {selectedLocation && (
        <InfoWindow
          position={selectedLocation.location}
          onCloseClick={handleInfoWindowCloseClick}
          options={{
            maxWidth: 300,
            pixelOffset: new window.google.maps.Size(0, -30),
            closeBoxURL: '', // Hide default close button
            enableEventPropagation: true,
          }}
        >
          <div>
            <GoogleMapsHoverCard poi={selectedLocation} restaurantId={selectedLocation.id} onClose={handleInfoWindowCloseClick} />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

MapComponent.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      restaurantName: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default MapComponent;
