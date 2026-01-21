import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';
import { createRestaurant } from '../../api/Restaurants';
import { useAuth } from '../../utils/context/authContext';

const libraries = ['places'];

const RestaurantForm = ({ id, editItem, onRestaurantCreated, updateRestaurant, isLoaded }) => {
  const { user } = useAuth(); // Get the current user
  const [formInput, setFormInput] = useState({
    restaurant_name: '',
    restaurant_address: '',
    website_url: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setFormInput({
        restaurant_name: editItem.restaurant_name || '',
        restaurant_address: editItem.restaurant_address || '',
        website_url: editItem.website_url || '',
      });
    } else {
      setFormInput({
        restaurant_name: '',
        restaurant_address: '',
        website_url: '',
      });
    }
  }, [editItem]);

  // Add the missing validateForm function
  const validateForm = () => {
    const newErrors = {};

    if (!formInput.restaurant_name.trim()) {
      newErrors.restaurant_name = 'Restaurant name is required';
    }

    if (!formInput.restaurant_address) {
      newErrors.restaurant_address = 'Restaurant address is required';
    }

    return newErrors;
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const restaurantAddress = formInput.restaurant_address.label || formInput.restaurant_address;

    const payload = {
      restaurant_name: formInput.restaurant_name,
      restaurant_address: restaurantAddress,
      website_url: formInput.website_url,
      uid: user.uid,
    };

    if (editItem && editItem.id) {
      updateRestaurant(editItem.id, payload)
        .then(() => {
          if (onRestaurantCreated) {
            onRestaurantCreated(editItem);
          }
        })
        .catch((error) => {});
    } else {
      createRestaurant(payload)
        .then((data) => {
          if (onRestaurantCreated) {
            onRestaurantCreated(data);
          }
        })
        .catch((error) => {});
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
      <button type="submit" className="button button-view">
        Submit
      </button>
    </Form>
  );
};

RestaurantForm.propTypes = {
  id: PropTypes.string,
  editItem: PropTypes.shape({
    id: PropTypes.number,
    restaurant_name: PropTypes.string,
    restaurant_address: PropTypes.string,
    website_url: PropTypes.string,
  }),
  onRestaurantCreated: PropTypes.func.isRequired,
  createRestaurant: PropTypes.func,
  updateRestaurant: PropTypes.func,
  isLoaded: PropTypes.bool.isRequired,
};

export default RestaurantForm;
