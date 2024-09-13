import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllDishes } from '../../api/Dish';
import { getAllCategories } from '../../api/Categories';
import { createFoodLog } from '../../api/FoodLog';

const initialState = {
  restaurant: '',
  dish: '',
  category: [],
};

function FoodLogForm() {
  const [formInput, setFormInput] = useState(initialState);
  const [restaurant, setRestaurant] = useState([]);
  const [dish, setDish] = useState([]);
  const [category, setCategory] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  // Fetch and set initial data
  useEffect(() => {
    const fetchData = async () => {
      const [restaurants, dishes, categories] = await Promise.all([getAllRestaurants(), getAllDishes(), getAllCategories()]);

      setRestaurant(restaurants);
      setDish(dishes);
      setCategory(categories);
      setFormInput((prevState) => ({
        ...prevState,
        restaurant: restaurants.length > 0 ? restaurants[0].restaurant_id : '',
        dish: dishes.length > 0 ? dishes[0].dish_id : '',
        category: categories.length > 0 ? [{ value: categories[0].category, label: categories[0].category }] : [],
      }));
    };

    fetchData();
  }, []);

  useEffect(() => {}, [formInput.restaurant, formInput.dish]);

  const handleChange = (selectedOption, actionMeta) => {
    if (!actionMeta) {
      return;
    }
    const { name } = actionMeta;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: selectedOption.value, // Store only the ID
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      restaurant_id: formInput.restaurant,
      dish_id: formInput.dish,
      category_ids: formInput.category ? formInput.category.map((cat) => cat.value) : [], // Ensure these are IDs
      uid: user.uid,
    };

    console.log('Payload before submission:', payload); // Log payload

    try {
      const response = await createFoodLog(payload);
      console.warn('API response:', response);
      router.push(`/food_log/${id}`);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <div>
<Form onSubmit={handleSubmit}>
    <Select
        name="restaurant"
        options={restaurant.map((type) => ({
            value: type.id,
            label: type.restaurant_name,
        }))}
        value={formInput.restaurant_id}
        onChange={(selectedOption, actionMeta) => handleChange(selectedOption, actionMeta)}
    />
    <Select
        name="dish"
        options={dish.map((type) => ({
            value: type.id,
            label: type.dish_name,
        }))}
        value={formInput.dish_id}
        onChange={(selectedOption, actionMeta) => handleChange(selectedOption, actionMeta)}
    />
    <Select
        name="category"
        options={category.map((type) => ({
            value: type.id,
            label: type.category,
        }))}
        value={formInput.category_id}
        onChange={(selectedOption, actionMeta) => handleChange(selectedOption, actionMeta)}
        isMulti
    />
    <Form.Control
        type="hidden"
        name="uid"
        value={formInput.uid}
        required
    />

        <Button variant="primary" type="submit">
          Submit!
        </Button>
      </Form>
    </div>
  );
}

FoodLogForm.defaultProps = {
  itemObj: initialState,
  viewType: '',
};

export default FoodLogForm;
