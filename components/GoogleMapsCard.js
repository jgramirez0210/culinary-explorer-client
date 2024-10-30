import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
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
        <InfoWindow position={selectedLocation.location} onCloseClick={handleInfoWindowCloseClick}>
          <>
            <GoogleMapsHoverCard poi={selectedLocation} restaurantId={selectedLocation.id} />
          </>
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
