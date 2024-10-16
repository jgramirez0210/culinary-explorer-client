import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getFoodLogByRestaurantId } from '../api/FoodLog';

const DishListByRestaurant = ({ restaurantId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        console.log(`restaurantId passed to DishListByRestaurant: ${restaurantId}`);
        const id = parseInt(restaurantId, 10);
        if (Number.isNaN(id)) {
          throw new Error(`Invalid restaurant ID: ${restaurantId}. Could not convert to a number.`);
        }
        const data = await getFoodLogByRestaurantId(id);
        if (data.message) {
          throw new Error(data.message);
        }
        setRestaurantData(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching restaurant data: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {restaurantData && Array.isArray(restaurantData) && restaurantData.map((item) => (
        <div key={item.id}>
          <h2>{item.dish.dish_name}</h2>
          <p>{item.dish.description}</p>
          <p>Notes: {item.dish.notes}</p>
          <img src={item.dish.food_image_url} alt={item.dish.dish_name} />
          <p>Price: ${item.dish.price}</p>
          <p>Categories: {item.category.map((cat) => cat.category).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

DishListByRestaurant.propTypes = {
  restaurantId: PropTypes.number.isRequired,
};

export default DishListByRestaurant;