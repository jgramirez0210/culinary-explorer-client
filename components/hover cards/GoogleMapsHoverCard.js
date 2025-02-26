import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DishListByRestaurant from '../DishListByRestaurant';

const GoogleMapsHoverCard = ({ poi, restaurantId, onClose }) => {
  const cardRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={cardRef} className="hover-card">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h1>{poi.restaurantName}</h1>
      <p>{poi.restaurantAddress}</p>
      {restaurantId && <DishListByRestaurant restaurantId={restaurantId} />}
    </div>
  );
};

GoogleMapsHoverCard.propTypes = {
  poi: PropTypes.shape({
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    restaurantName: PropTypes.string.isRequired,
    restaurantAddress: PropTypes.string.isRequired,
  }).isRequired,
  restaurantId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GoogleMapsHoverCard;
