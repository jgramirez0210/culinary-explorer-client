import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InfoWindow } from '@react-google-maps/api';
import DishListByRestaurant from '../DishListByRestaurant';

const GoogleMapsHoverCard = ({ poi, restaurantId }) => { /* eslint-disable no-unused-vars */
  const [activeMarker, setActiveMarker] = useState(null);/* eslint-disable no-unused-vars */

  const handleInfoWindowCloseClick = () => {
    setActiveMarker(null);
  };

  const handleMarkerMouseClick = (marker) => { /* eslint-disable no-unused-vars */
    setActiveMarker(marker);
  };

  return (
    <InfoWindow position={poi.getPosition()} onCloseClick={handleInfoWindowCloseClick}>
      <div>
        <h3>{poi.getTitle()}</h3>
        <p>{poi.getPosition().toString()}</p>
        {restaurantId ? <DishListByRestaurant restaurantId={restaurantId} /> : <p>Error: Invalid restaurant ID</p>}
      </div>
    </InfoWindow>
  );
};

GoogleMapsHoverCard.propTypes = {
  poi: PropTypes.shape({
    getPosition: PropTypes.func.isRequired,
    getTitle: PropTypes.func.isRequired,
  }).isRequired,
  restaurantId: PropTypes.string.isRequired,
};

export default GoogleMapsHoverCard;
