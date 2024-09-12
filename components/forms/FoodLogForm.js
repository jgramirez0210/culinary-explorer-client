import React, { useEffect, useState, Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllDishes } from '../../api/Dish';
import { getAllCategories } from '../../api/Categories';

const initialState = {
  id: null,
  restaurant: {
    restaurant_name: '',
    restaurant_address: '',
    website_url: '',
  },
  dish: {
    food_image_url: '',
    dish_name: '',
    price: 0,
    description: '',
    notes: '',
    short_description: '',
  },
  category: [],
};

function FoodLogForm({ itemObj, viewType }) {
  const [formState, setFormState] = useState(initialState);
  const [restaurant, setRestaurant] = useState([]);
  const [dish, setDish] = useState([]);
  const [category, setCategory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (itemObj) {
      setFormState(itemObj);
    }
  }, [itemObj]);

  useEffect(() => {
    getAllRestaurants()
      .then((types) => {
        setRestaurant(types);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getAllDishes()
      .then((types) => {
        setDish(types);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getAllCategories()
      .then((types) => {
        console.warn('Fetched categories', types);
        setCategory(types);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Select name="restaurant" value={formState.restaurant || ''} onChange={handleChange}>
          {restaurant.map((type) => (
            <option key={type.id} value={type.id}>
              {type.restaurant_name}
            </option>
          ))}
        </Form.Select>
        <Form.Select name="dish" value={formState.dish || ''} onChange={handleChange}>
          {dish.map((type) => (
            <option key={type.id} value={type.id}>
              {type.dish_name}
            </option>
          ))}
        </Form.Select>

        <div className='container'>
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <Select
              options={category.map(cat => ({ value: cat.category, label: cat.category }))}
              components={makeAnimated()}
              isMulti
            />
          </div>
          <div className='col-md-3'></div>
        </div>
      </div>

        <Button variant="primary" type="submit">
          Submit!
        </Button>
      </Form>
    </div>
  );
}

FoodLogForm.propTypes = {
  itemObj: PropTypes.shape({
    skill_level: PropTypes.string,
    // Add other properties as needed
  }),
  viewType: PropTypes.any.isRequired,
};

export default FoodLogForm;
