import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * A hover card component for displaying information about a restaurant on Google Maps.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.location - The location object containing restaurant information.
 * @returns {JSX.Element} The rendered GoogleMapsHoverCard component.
 */
const GoogleMapsHoverCard = ({ location }) => {
  useEffect(() => {
    console.log('Rendering GoogleMapsHoverCard for:', location);
  }, [location]);

  if (!location) return null; // Ensure valid data

  return (
    <div className="hover-card">
      <h3>{location.restaurant_name || 'Restaurant'}</h3>
      <p>{location.restaurant_address || 'Address not available'}</p>
    </div>
  );
};

GoogleMapsHoverCard.propTypes = {
  location: PropTypes.shape({
    restaurant_name: PropTypes.string.isRequired,
    restaurant_address: PropTypes.string.isRequired,
  }).isRequired,
};

export default GoogleMapsHoverCard;
