import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';
import { useGoogleMaps } from './GoogleMapsProvider';

const center = { lat: 29.749907, lng: -95.358421 };

// Dark mode styles for the map
const darkMapStyles = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#1d2c4d' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

/**
 * Renders a Google Map component with markers and info windows.
 *
 * @param {Object[]} locations - An array of locations to be displayed as markers on the map.
 * @returns {JSX.Element} The rendered Google Map component.
 */
const MapComponent = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { isLoaded } = useGoogleMaps();

  const handleInfoWindowCloseClick = () => {
    setSelectedLocation(null);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="google-map-container"
        center={center}
        zoom={10}
        options={{
          styles: darkMapStyles,
          backgroundColor: 'transparent',
        }}
      >
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
              closeBoxURL: '',
              enableEventPropagation: true,
            }}
          >
            <div className="info-window-content">
              <GoogleMapsHoverCard poi={selectedLocation} restaurantId={selectedLocation.id} onClose={handleInfoWindowCloseClick} />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

MapComponent.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      restaurantName: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default MapComponent;
