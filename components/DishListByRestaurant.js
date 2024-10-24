import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFoodLogByRestaurantId } from '../api/FoodLog';

const DishListByRestaurant = ({ restaurantId }) => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    if (restaurantId) {
      getFoodLogByRestaurantId(restaurantId)
        .then((data) => {
          setDishes(data);
        })
        .catch((error) => {
          console.error('Error fetching restaurant data:', error);
        });
    }
  }, [restaurantId]);

  return (
    <div>
      <ul>
        {dishes.map((dish) => (
          <li key={dish.id}>
            <h4>{dish.dish.dish_name}</h4>
            <p>{dish.dish.description}</p>
            <p>Notes: {dish.dish.notes}</p>
            <p>Price: ${dish.dish.price}</p>
            <p>Categories: {dish.category.map((cat) => cat.category).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
DishListByRestaurant.propTypes = {
  restaurantId: PropTypes.number.isRequired,
};

export default DishListByRestaurant;
