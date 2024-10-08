import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { createRestaurant } from '../../api/Restaurants';

const RestaurantForm = ({ id, updateRestaurant, onRestaurantCreated }) => {
  const [formInput, setFormInput] = useState({
    restaurant_name: '',
    restaurant_address: '',
    website_url: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form input
    const newErrors = {};
    if (!formInput.restaurant_name) newErrors.restaurant_name = 'Restaurant name is required';
    if (!formInput.restaurant_address) newErrors.restaurant_address = 'Restaurant address is required';
    if (!formInput.website_url) newErrors.website_url = 'Website URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      restaurant_name: formInput.restaurant_name,
      restaurant_address: formInput.restaurant_address,
      website_url: formInput.website_url
    };

    console.warn('Creating new restaurant with payload:', payload);
    if (id) {
      updateRestaurant(id, payload)
        .then(() => {
          // router.push(`/food_log`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      createRestaurant(payload)
        .then(() => {
          if (onRestaurantCreated) {
            onRestaurantCreated();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="dishName">
        <Form.Label>Restaurant Name</Form.Label>
        <Form.Control
          type="text"
          name="restaurant_name"
          value={formInput.restaurant_name}
          onChange={handleChange}
          placeholder="Enter restaurant name"
          isInvalid={!!errors.restaurant_name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.restaurant_name}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Restaurant Address</Form.Label>
        <Form.Control
          type="text"
          name="restaurant_address"
          value={formInput.restaurant_address}
          onChange={handleChange}
          placeholder="Restaurant Address"
          isInvalid={!!errors.restaurant_address}
        />
        <Form.Control.Feedback type="invalid">
          {errors.restaurant_address}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="notes">
        <Form.Label>Website Url</Form.Label>
        <Form.Control
          type="text"
          name="website_url"
          value={formInput.website_url}
          onChange={handleChange}
          placeholder="Website URL"
          isInvalid={!!errors.website_url}
        />
        <Form.Control.Feedback type="invalid">
          {errors.website_url}
        </Form.Control.Feedback>
      </Form.Group>
      <button type="submit">Submit a New Restaurant</button>
    </Form>
  );
};

export default RestaurantForm;
