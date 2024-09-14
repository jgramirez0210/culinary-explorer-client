import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllDishes } from '../../api/Dish';
import { getAllCategories } from '../../api/Categories';
import { createFoodLog, getSingleFoodLog } from '../../api/FoodLog';

const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
  uid: '',
};

function FoodLogForm() {
  const [formInput, setFormInput] = useState(initialState);
  const [restaurant, setRestaurant] = useState([]);
  const [dish, setDish] = useState([]);
  const [category, setCategory] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  
  // Fetch and set initial data for form dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const restaurants = await getAllRestaurants();
      const dishes = await getAllDishes();
      const categories = await getAllCategories();
  
      setRestaurant(restaurants);
      setDish(dishes);
      setCategory(categories);
      setFormInput((prevState) => ({
        ...prevState,
        restaurant: restaurants.length > 0 ? restaurants[0].restaurant_id : '',
        dish: dishes.length > 0 ? dishes[0].dish_id : '',
        category_ids: category.map(cat => cat.id),
      }));
    };
  
    fetchData();
  }, []);
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log("formInput.category_ids:", formInput.category_ids);
    // Clean up the payload
    const payload = {
      restaurant_id: formInput.restaurant_id,
      dish_id: formInput.dish_id,
      category_ids: formInput.category,
      uid: user.uid,
    };
    console.log('Payload being sent to createFoodLog API:', payload);
  
    try {
      await createFoodLog(payload);
      router.push('/');
    } catch (error) {
      console.error('Error creating food log:', error);
    }
  };


  const handleInputChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleMultiInputChange = (selectedOptions, { name }) => {
  //   const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
  //   setFormInput((prevState) => ({
  //     ...prevState,
  //     [name]: values,
  //   }));
  // };
  const handleMultiInputChange = (selectedOptions) => {
    setFormInput((prevState) => ({
      ...prevState,
      category: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Select
          name="restaurant_id"
          placeholder="Select a restaurant"
          options={restaurant.map((type) => ({
            value: type.id,
            label: type.restaurant_name,
          }))}
          value={restaurant.find(option => option.id === formInput.restaurant)}
          onChange={handleInputChange}
        />
        <Select
          name="dish_id"
          placeholder="Select a dish"
          options={dish.map((type) => ({
            value: type.id,
            label: type.dish_name,
          }))}
          value={dish.find(option => option.id === formInput.dish)}
          onChange={handleInputChange}
        />
        <Select
          name="category"
          placeholder="Select a category"
          options={category.map((type) => ({
            value: type.id,
            label: type.category,
          }))}
          value={formInput.value}
          onChange={(selectedOption, actionMeta) => handleMultiInputChange(selectedOption, actionMeta)}
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
