import React from 'react';
import PropTypes from 'prop-types';
import DishListByRestaurant from '../DishListByRestaurant';

/**
 * A hover card component for displaying information about a restaurant on Google Maps.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.poi - The point of interest object containing restaurant information.
 * @param {number} props.restaurantId - The ID of the restaurant.
 * @returns {JSX.Element} The rendered GoogleMapsHoverCard component.
 */
const GoogleMapsHoverCard = ({ location }) => {
  return (
    <div style={{ padding: '15px', maxWidth: '300px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600' }}>{location.restaurant_name || 'Restaurant'}</h3>
      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>{location.restaurant_address || 'Address not available'}</p>
      {location.rating && <p style={{ margin: '0', fontSize: '14px', color: '#444' }}>Rating: {location.rating}/5</p>}
    </div>
  );
};

GoogleMapsHoverCard.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    restaurant_name: PropTypes.string.isRequired,
    restaurant_address: PropTypes.string.isRequired,
    rating: PropTypes.number,
  }).isRequired,
};

export default GoogleMapsHoverCard;
