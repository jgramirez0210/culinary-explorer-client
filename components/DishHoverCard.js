import React from 'react';

const DishHoverCard = ({ dish, position = { x: 50, y: 50 } }) => {
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
      {dish ? <p>{dish.dish_name}</p> : <p>No dish data available</p>}
      <p>Description: {dish.description}</p>
    </div>
  );
};

export default DishHoverCard;
