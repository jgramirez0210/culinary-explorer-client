import React from 'react';
import PropTypes from 'prop-types';

const RestaurantHoverCard = ({ item, position }) => {
  const cardStyle = {
    position: 'absolute',
    top: position ? `${position.y}px` : 'auto',
    left: position ? `${position.x}px` : 'auto',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  return (
    <div style={cardStyle}>
      {item ? <p>{item.restaurant_name}</p> : <p>No restaurant data available</p>}
      <p>Address: {item.restaurant_address}</p>
      {item.website_url ? (
        <p>
          Website: <a href={item.website_url} target="_blank" rel="noopener noreferrer">{item.website_url}</a>
        </p>
      ) : (
        <p>Website: Not available</p>
      )}
    </div>
  );
};

RestaurantHoverCard.propTypes = {
  item: PropTypes.shape({
    restaurant_name: PropTypes.string,
    restaurant_address: PropTypes.string,
    website_url: PropTypes.string,
  }),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

RestaurantHoverCard.defaultProps = {
  item: null,
  position: { x: 50, y: 50 },
};

export default RestaurantHoverCard;
