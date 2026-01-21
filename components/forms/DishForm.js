// Importing necessary modules and functions
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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

function DishForm({ editItem, onDishCreated }) {
  const [formInput, setFormInput] = useState(initialState);

  useEffect(() => {
    if (editItem) {
      setFormInput({
        dish_name: editItem.dish_name || '',
        description: editItem.description || '',
        notes: editItem.notes || '',
        food_image_url: editItem.food_image_url || '',
        price: editItem.price || '',
      });
    } else {
      setFormInput(initialState);
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Constructing the dish object
    const payload = {
      dish_name: formInput.dish_name,
      description: formInput.description,
      notes: formInput.notes,
      food_image_url: formInput.food_image_url,
      price: parseFloat(formInput.price), // Ensure price is a number
    };

    if (editItem && editItem.id) {
      // If an editItem is present, update the dish
      updateDish(editItem.id, payload)
        .then(() => {
          if (onDishCreated) {
            onDishCreated(editItem);
          }
        })
        .catch((error) => {});
    } else {
      // Otherwise, create a new dish
      createDish(payload)
        .then((data) => {
          if (onDishCreated) {
            onDishCreated(data);
          }
        })
        .catch((error) => {});
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
        <Form.Control as="textarea" rows={3} name="description" value={formInput.description} onChange={handleChange} placeholder="Enter description" />
      </Form.Group>
      <Form.Group controlId="notes">
        <Form.Label>Notes</Form.Label>
        <Form.Control as="textarea" rows={3} name="notes" value={formInput.notes} onChange={handleChange} placeholder="Enter notes" />
      </Form.Group>
      <Form.Group controlId="foodImageUrl">
        <Form.Label>Food Image URL</Form.Label>
        <Form.Control type="text" name="food_image_url" value={formInput.food_image_url} onChange={handleChange} placeholder="Enter food image URL" />
      </Form.Group>
      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price" value={formInput.price} onChange={handleChange} placeholder="Enter price" />
      </Form.Group>
      <button type="submit" className="button button-view">
        Submit Dish
      </button>
    </Form>
  );
}

DishForm.propTypes = {
  editItem: PropTypes.shape({
    id: PropTypes.number,
    dish_name: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    food_image_url: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onDishCreated: PropTypes.func.isRequired,
};

export default DishForm;
