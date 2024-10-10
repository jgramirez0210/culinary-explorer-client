import React from 'react';

const DishHoverCard = ({ item, position = { x: 50, y: 50 } }) => {
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
      {item ? (
        <>
          <p>{item.dish_name}</p>
          {item.food_image_url && <img src={item.food_image_url} alt={item.dish_name} style={{ width: '100px', height: '100px' }} />}
          <p>Description: {item.description ? item.description : 'No description available'}</p>
          <p>Notes: {item.notes}</p>
          <p>Price: {item.price}</p>
        </>
      ) : (
        <p>No dish data available</p>
      )}
    </div>
  );
};

export default DishHoverCard;
