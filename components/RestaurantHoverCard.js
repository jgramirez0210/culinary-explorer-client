import React from 'react';

const RestaurantHoverCard = ({ item, position = { x: 50, y: 50 } }) => {
  const cardStyle = {
    position: 'absolute',
    top: `${position.y}px`,
    left: `${position.x}px`,
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

export default RestaurantHoverCard;
