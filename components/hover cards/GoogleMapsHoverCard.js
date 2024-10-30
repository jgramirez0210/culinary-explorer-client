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
const GoogleMapsHoverCard = ({ poi, restaurantId }) => (
  <div>
    <h1>{poi.restaurantName}</h1>
    <p>{poi.restaurantAddress}</p>
    <DishListByRestaurant restaurantId={restaurantId} />
  </div>
);

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
};

export default GoogleMapsHoverCard;
