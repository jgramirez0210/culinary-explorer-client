import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const DishHoverCard = ({ item = null, position }) => {
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

  // console.warn('Image URL:', item?.food_image_url);

  return (
    <div style={cardStyle}>
      {item ? (
        <>
          <p>{item.dish_name}</p>
          {item.food_image_url && (
            <Image
              src={item.food_image_url}
              alt={item.dish_name}
              width={100}
              height={100}
              style={{ width: '100px', height: '100px' }}
            />
          )}
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
DishHoverCard.propTypes = {
  item: PropTypes.shape({
    dish_name: PropTypes.string,
    food_image_url: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    price: PropTypes.string,
  }),
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default DishHoverCard;
