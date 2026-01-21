import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getFoodLogByRestaurantId } from '../api/FoodLog';
import { useAuth } from '../utils/context/authContext';

const DishListByRestaurant = ({ restaurantId }) => {
  const [dishes, setDishes] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDishes = () => {
      if (restaurantId && user && user.uid) {
        getFoodLogByRestaurantId(restaurantId, user.uid)
          .then((data) => {
            setDishes(data);
            localStorage.setItem('dishDataLastFetched', Date.now());
          })
          .catch(() => {});
      }
    };

    const checkForUpdate = () => {
      const lastChange = localStorage.getItem('dishDataLastChange');
      const lastFetched = localStorage.getItem('dishDataLastFetched') || 0;
      if (lastChange && lastChange > lastFetched) {
        fetchDishes();
      } else {
        fetchDishes();
      }
    };

    checkForUpdate();

    const handleStorage = (e) => {
      if (e.key === 'dishDataLastChange') {
        fetchDishes();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, [restaurantId, user]);

  const handleDishClick = (dishId) => {
    router.push(`/food_log/${dishId}`);
  };

  return (
    <div>
      <ul>
        {dishes.map((dish) => (
          <li key={dish.id} onClick={() => handleDishClick(dish.id)} style={{ cursor: 'pointer' }}>
            <h4>{dish.dish.dish_name}</h4>
            <p>{dish.dish.description}</p>
            <p>Notes: {dish.dish.notes}</p>
            <p>Price:{dish.dish.price}</p>
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
