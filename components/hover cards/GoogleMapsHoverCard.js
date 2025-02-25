import React from 'react';
import { useEffect } from 'react';
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
    <div style={{ padding: '15px', maxWidth: '300px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600' }}>{location.restaurant_name || 'Restaurant'}</h3>
      <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>{location.restaurant_address || 'Address not available'}</p>
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
