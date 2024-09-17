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
  const [currentGame, setCurrentGame] = useState(initialState);
  const [formInput, setFormInput] = useState(initialState);
  const [restaurant, setRestaurant] = useState([]);
  const [dish, setDish] = useState([]);
  const [category, setCategory] = useState([]);
  const router = useRouter();
  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (id) {
      getSingleFoodLog(id)
        .then((singleFoodLog) => {
          setFormInput(singleFoodLog);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setFormInput(initialState);
    }

    getAllRestaurants()
      .then((restaurants) => {
        setRestaurant(restaurants);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllDishes()
      .then((dishes) => {
        setDish(dishes);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllCategories()
      .then((categories) => {
        setCategory(categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);



  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Constructing the Food log object
    const payload = {
      restaurant_id: formInput.restaurant[0],
      dish_id: formInput.dish[0], 
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
      // If no id is present, create a new Food log
      createFoodLog(payload)
        .then(() => {
          // console.warn('Food log created', payload);
          router.push('/');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
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

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{editObj && editObj.id ? 'Update' : 'Create'} Food Entry</h2>
      
      <Form.Group className="mb-3">
        <Form.Label>Restaurant Name</Form.Label>
        <Form.Select
          as="select"
          name="restaurant"
          value={formInput.restaurant_id}
          onChange={handleChange}
        
          required
        >
         <option value="">Select a restaurant</option>
         {restaurant.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.restaurant_name}
            </option>
          ))}
        </Form.Select>

        <Form.Label>Dish Name</Form.Label>
        <Form.Select
          as="select"
          name="dish"
          value={formInput.dish_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a dish</option>
          {dish.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.dish_name}
            </option>
          ))}
        </Form.Select>

        <Form.Label>Select Categories</Form.Label>
        <Select
          name="category"
          value={category.filter((cat) => formInput.category_ids.includes(cat.id)).map((cat) => ({ value: cat.id, label: cat.category }))}
          options={category.map((cat) => ({ value: cat.id, label: cat.category }))}
          isMulti
          onChange={handleMultiSelectChange}
        />

      </Form.Group>
      <Button variant="primary" type="submit">
        Submit!
      </Button>
    </Form>
  );
}

// Prop types for the FoodLogForm component
FoodLogForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
};

export default FoodLogForm;