import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useJsApiLoader } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';

const RestaurantForm = ({
  id,
  onRestaurantCreated,
  createRestaurant,
  updateRestaurant,
}) => {
  const [formInput, setFormInput] = useState({
    restaurant_name: '',
    restaurant_address: '',
    website_url: '',
  });
  const [errors, setErrors] = useState({});
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const handleSubmit = (event) => {
    event.preventDefault();
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
        <GooglePlacesAutocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          selectProps={{
            value: formInput.restaurant_address,
            onChange: (value) => handleChange({ target: { name: 'restaurant_address', value } }),
            placeholder: 'Restaurant Address',
            isInvalid: !!errors.restaurant_address,
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.restaurant_address}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="websiteUrl">
        <Form.Label>Website Url</Form.Label>
        <Form.Control type="text" name="website_url" value={formInput.website_url} onChange={handleChange} placeholder="Website URL" isInvalid={!!errors.website_url} />
        <Form.Control.Feedback type="invalid">{errors.website_url}</Form.Control.Feedback>
      </Form.Group>
      <button type="submit">Submit a New Restaurant</button>
    </Form>
  );
};

RestaurantForm.propTypes = {
  id: PropTypes.string,
  updateRestaurant: PropTypes.func,
  createRestaurant: PropTypes.func,
  onRestaurantCreated: PropTypes.func,
};

export default RestaurantForm;
