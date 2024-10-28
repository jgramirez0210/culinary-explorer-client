import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsHoverCard from './hover cards/GoogleMapsHoverCard';

const Map = ({ locations }) => {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.749907, lng: -95.358421 },
        zoom: 8,
      });

      const createMarker = ({ location, restaurantName }) => {
        const marker = new window.google.maps.Marker({
          position: location,
          map,
          title: restaurantName,
        });

        marker.addListener('click', () => {
          setActiveMarker(marker);
        });

        return marker;
      };

      locations.forEach(createMarker);
    }
  }, [locations]);

  return (
    <div ref={mapRef} style={{ height: '500px', width: '100%' }}>
      {activeMarker && <GoogleMapsHoverCard poi={activeMarker} restaurantId={activeMarker.restaurantId} />}
    </div>
  );
};

Map.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      restaurantName: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Map;
