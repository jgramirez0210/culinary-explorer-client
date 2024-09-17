// Importing necessary modules and functions
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { getSingleFoodLog, updateFoodLog, createFoodLog } from '../../api/FoodLog';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllCategories } from '../../api/Categories';
import { getAllDishes } from '../../api/Dish';

// Initial state for the form
const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
};
function FoodLogForm({ user, editObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [restaurantList, setRestaurants] = useState([]);
  const [dishList, setDishes] = useState([]);
  const [categoryList, setCategories] = useState([]);
  const router = useRouter();
  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (editObj) {
      setFormInput({
        restaurant_id: editObj.restaurant.id,
        dish_id: editObj.dish.id,
        category_ids: editObj.category.map(cat => cat.id),
      });
    } else {
      setFormInput(initialState);
    }

    getAllRestaurants()
      .then((restaurantList) => {
        setRestaurants(restaurantList);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllDishes()
      .then((dishList) => {
        setDishes(dishList);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllCategories()
      .then((categoryList) => {
        setCategories(categoryList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [editObj]);


  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Constructing the Food log object
    const payload = {
      restaurant_id: formInput.restaurant_id,
      dish_id: formInput.dish_id,
      category_ids: formInput.category_ids.map(Number),
      uid: user.uid,
    };
    console.warn('Payload:', payload);
  
    if (id) {
      // If an id is present, update the Food log
      updateFoodLog(id, payload)
        .then(() => {
          router.push(`/food_log/${id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Otherwise, create a new Food log
      createFoodLog(payload)
        .then(() => {
          router.push('/food_log');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormInput((prevState) => ({
      ...prevState,
      category_ids: selectedValues,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (editObj && editObj.id) {
    console.warn(`editObj.id: ${editObj.id}`);
  }
  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{editObj && editObj.id ? 'Update' : 'Create'} Food Entry</h2>

      <Form.Group className="mb-3">
        <Form.Label>Restaurant Name</Form.Label>
        <Form.Select as="select" name="restaurant_id" value={formInput.restaurant_id} onChange={handleChange} required>
          <option value="">Select a restaurant</option>
          {restaurantList.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.restaurant_name}
            </option>
          ))}
        </Form.Select>

        <Form.Label>Dish Name</Form.Label>
        <Form.Select as="select" name="dish_id" value={formInput.dish_id} onChange={handleChange} required>
          <option value="">Select a dish</option>
          {dishList.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.dish_name}
            </option>
          ))}
        </Form.Select>

        <Form.Label>Select Categories</Form.Label>
        <Select
          name="category_ids"
          value={categoryList.filter((cat) => Array.isArray(formInput.category_ids) && formInput.category_ids.includes(cat.id)).map((cat) => ({ value: cat.id, label: cat.category }))}
          options={categoryList.map((cat) => ({ value: cat.id, label: cat.category }))}
          isMulti
          onChange={handleMultiSelectChange}
        />
      </Form.Group>

      <button type="submit">Submit</button>
    </Form>
  );
};

// Prop types for the FoodLogForm component
FoodLogForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  editObj: PropTypes.shape({
    id: PropTypes.string,
  }),
};

// Default props for the FoodLogForm component
FoodLogForm.defaultProps = {
  editObj: null,
};

export default FoodLogForm;
