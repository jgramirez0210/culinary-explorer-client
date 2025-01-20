import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';
import { createRestaurant } from '../../api/Restaurants';

const libraries = ['places'];

const RestaurantForm = ({ id, onRestaurantCreated, updateRestaurant, isLoaded }) => {
  const [formInput, setFormInput] = useState({
    restaurant_name: '',
    restaurant_address: '',
    website_url: '',
  });

  const [errors, setErrors] = useState({});

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  console.log('RestaurantForm props:', { isLoaded });

  const handleSubmit = () => {
    // event.preventDefault();
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
      restaurant_address: formInput.restaurant_address.label || formInput.restaurant_address,
      website_url: formInput.website_url,
    };

    if (id) {
      updateRestaurant(id, payload)
        .then(() => {
          if (onRestaurantCreated) {
            onRestaurantCreated();
          }
        })
        .catch((error) => {
          console.error('Error updating restaurant:', error);
        });
    } else {
      createRestaurant(payload)
        .then(() => {
          if (onRestaurantCreated) {
            onRestaurantCreated();
          }
        })
        .catch((error) => {
          console.error('Error creating restaurant:', error);
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
      [name]: '',
    }));
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="restaurantName">
        <Form.Label>Restaurant Name</Form.Label>
        <Form.Control type="text" name="restaurant_name" value={formInput.restaurant_name} onChange={handleChange} placeholder="Enter restaurant name" isInvalid={!!errors.restaurant_name} />
        <Form.Control.Feedback type="invalid">{errors.restaurant_name}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="restaurantAddress">
        <Form.Label>Restaurant Address</Form.Label>
        {isLoaded && (
          <GooglePlacesAutocomplete
            selectProps={{
              value: formInput.restaurant_address,
              onChange: (value) => setFormInput({ ...formInput, restaurant_address: value }),
              placeholder: 'Restaurant Address',
            }}
          />
        )}
      </Form.Group>

      <Form.Group controlId="websiteUrl">
        <Form.Label>Website Url</Form.Label>
        <Form.Control type="text" name="website_url" value={formInput.website_url} onChange={handleChange} placeholder="Enter website URL" isInvalid={!!errors.website_url} />
        <Form.Control.Feedback type="invalid">{errors.website_url}</Form.Control.Feedback>
      </Form.Group>
      <button type="submit">Submit</button>
    </Form>
  );
};

RestaurantForm.propTypes = {
  id: PropTypes.string,
  onRestaurantCreated: PropTypes.func.isRequired,
  createRestaurant: PropTypes.func,
  updateRestaurant: PropTypes.func,
  isLoaded: PropTypes.bool.isRequired,
};

export default RestaurantForm;
