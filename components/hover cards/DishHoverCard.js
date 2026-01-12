import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const DishHoverCard = ({ item = null, position }) => {
  const cardStyle = {
    position: 'absolute',
    top: position ? `${position.y}px` : 'auto',
    left: position ? `${position.x}px` : 'auto',
    zIndex: 1000,
  };

  return (
    <div style={cardStyle} className="hover-card">
      {item ? (
        <>
          <p>{item.dish_name}</p>
          {item.food_image_url && <Image src={item.food_image_url} alt={item.dish_name} width={100} height={100} style={{ width: '100px', height: '100px' }} />}
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
