// import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';

// const center = { lat: 29.749907, lng: -95.358421 };

// /**
//  * Renders a Google Map component with markers and info windows.
//  *
//  * @param {Object[]} locations - An array of locations to be displayed as markers on the map.
//  * @returns {JSX.Element} The rendered Google Map component.
//  */
// const MapComponent = ({ locations, isLoaded }) => {
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const handleInfoWindowCloseClick = () => {
//     setSelectedLocation(null);
//   };

//   const handleMarkerClick = (location) => {
//     setSelectedLocation(location);
//   };

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
//       {locations.map((poi) => {
//         const restaurantId = poi.id;

//         return <Marker key={restaurantId} position={poi.location} title={poi.restaurantName} onClick={() => handleMarkerClick(poi)} />;
//       })}
//       {selectedLocation && (
//         <InfoWindow position={selectedLocation.location} onCloseClick={handleInfoWindowCloseClick}>
//           <>
//             <GoogleMapsHoverCard poi={selectedLocation} restaurantId={selectedLocation.id} />
//           </>
//         </InfoWindow>
//       )}
//     </GoogleMap>
//   );
// };

// MapComponent.propTypes = {
//   locations: PropTypes.arrayOf(
//     PropTypes.shape({
//       location: PropTypes.shape({
//         lat: PropTypes.number.isRequired,
//         lng: PropTypes.number.isRequired,
//       }).isRequired,
//       restaurantName: PropTypes.string.isRequired,
//     }).isRequired,
//   ).isRequired,
// };

// export default MapComponent;

import React, { useEffect } from 'react';
import { loadGoogleMapsScript } from '../utils/GoogleMapsScripts';

// Initialize and add the map
const initMap = () => {
  const position = { lat: -25.344, lng: 131.031 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: position,
    mapId: 'DEMO_MAP_ID',
  });

  const marker = new google.maps.AdvancedMarkerElement({
    position: position,
    map: map,
    title: 'Uluru',
  });
};

const GoogleMapsCard = () => {
  useEffect(() => {
    loadGoogleMapsScript(initMap);
  }, []);

  return <div id="map" style={{ height: '400px', width: '800px' }}></div>;
};

export default GoogleMapsCard;
