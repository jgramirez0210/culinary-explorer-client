// Importing necessary modules and functions
import { useRouter, Router } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { createDish, updateDish } from '../../api/Dish';

// Initial state for the form
const initialState = {
  dish_name: '',
  description: '',
  notes: '',
  food_image_url: '',
  price: '',
};

function DishForm({ onDishCreated }) {
  const [formInput, setFormInput] = useState(initialState);
  const { query } = useRouter();
  const { id } = query;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Constructing the Food log object
    const payload = {
      dish_name: formInput.dish_name,
      description: formInput.description,
      notes: formInput.notes,
      food_image_url: formInput.food_image_url,
      price: parseFloat(formInput.price), // Ensure price is a number
    };

    if (id) {
      // If an id is present, update the Food log
      updateDish(id, payload)
        .then(() => {
          // router.push(`/food_log`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Otherwise, create a new Food log
      createDish(payload)
        .then(() => {
          if (onDishCreated) {
            onDishCreated();
          }
          Router.push('/food_log');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="dishName">
        <Form.Label>Dish Name</Form.Label>
        <Form.Control type="text" name="dish_name" value={formInput.dish_name} onChange={handleChange} placeholder="Enter dish name" />
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" value={formInput.description} onChange={handleChange} placeholder="Enter description" />
      </Form.Group>
      <Form.Group controlId="notes">
        <Form.Label>Notes</Form.Label>
        <Form.Control type="text" name="notes" value={formInput.notes} onChange={handleChange} placeholder="Enter notes" />
      </Form.Group>
      <Form.Group controlId="foodImageUrl">
        <Form.Label>Food Image URL</Form.Label>
        <Form.Control type="text" name="food_image_url" value={formInput.food_image_url} onChange={handleChange} placeholder="Enter food image URL" />
      </Form.Group>
      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="text" name="price" value={formInput.price} onChange={handleChange} placeholder="Enter price" />
      </Form.Group>
      <button type="submit">Food Log Submit</button>
    </Form>
  );
}

DishForm.propTypes = {
  editObj: PropTypes.shape({
    dish_name: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    food_image_url: PropTypes.string,
    price: PropTypes.string,
  }),
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  onDishCreated: PropTypes.func.isRequired,
};

export default DishForm;
