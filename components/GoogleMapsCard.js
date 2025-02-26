import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';
import { useGoogleMaps } from './GoogleMapsProvider';

const center = { lat: 29.749907, lng: -95.358421 };

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
      <GoogleMap mapContainerClassName="google-map-container" center={center} zoom={10}>
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
            <div>
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
