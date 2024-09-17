import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllDishes } from '../../api/Dish';
import { getAllCategories } from '../../api/Categories';
import { createFoodLog } from '../../api/FoodLog';

const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
};

/**
 * Represents a form component for creating or updating a food log entry.
 *
 * @param {Object} props - The props containing the data for editing the food log entry.
 * @returns {JSX.Element} The JSX element representing the food log form.
 */
function FoodLogForm2({ editObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [restaurant, setRestaurant] = useState([]);
  const [dish, setDish] = useState([]);
  const [category, setCategory] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  // Fetch and set initial data for form dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurants = await getAllRestaurants();
        const dishes = await getAllDishes();
        const categories = await getAllCategories();

        setRestaurant(restaurants);
        setDish(dishes);
        setCategory(categories);

        // Debugging logs
        console.warn('editObj:', editObj);

        // Set form input based on editObj if it exists
        if (editObj) {
          setFormInput(editObj);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [editObj]);

  // Update formInput when editObj changes
  useEffect(() => {
    if (editObj) {
      setFormInput(editObj);
    }
  }, [editObj]);

  const handleMultiInputChange = (selectedOptions) => {
    setFormInput((prevState) => ({
      ...prevState,
      category: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const handleInputChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...formInput, category_ids: formInput.category, uid: user.uid };
    try {
      await createFoodLog(payload);
      router.push('/');
    } catch (error) {
      console.error('Error creating food log:', error);
    }
  };

  console.warn('editObj:', editObj);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h2 className="text-white mt-5">{editObj && editObj.id ? 'Update' : 'Create'} Food Log Entry</h2>

        <Form.Label>Restaurant Name</Form.Label>
        <Form.Select
          name="restaurant"
          value={currentGame.game_type}
          onChange={handleChange}
        >
          {gameTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </Form.Select>
        <Select
          name="dish_id"
          placeholder="Select a dish"
          options={dish.map((type) => ({
            value: type.id,
            label: type.dish_name,
          }))}
          value={editObj ? { value: editObj.dish.id, label: editObj.dish.dish_name } : dish.find((option) => option.id === formInput.dish)}
          onChange={handleInputChange}
        />
        <Form.Control as={Select} 
        options={category.map((cat) => ({ value: cat.id, label: cat.category }))} 
        value={editObj && editObj.category ? editObj.category.map((cat) => ({ value: cat.id, label: cat.category })) : (formInput.category || []).map((catId) => category.find((cat) => cat.id === catId))} 
        onChange={(selectedOption, actionMeta) => handleMultiInputChange(selectedOption, actionMeta)} 
        isMulti />

        
        <Form.Control type="hidden" name="uid" value={formInput.uid} required />
        <Button variant="primary" type="submit">
          Submit!
        </Button>
      </Form>
    </div>
  );
}

FoodLogForm.propTypes = {
  editObj: PropTypes.shape({
    id: PropTypes.number,
    restaurant: PropTypes.shape({
      id: PropTypes.number,
      restaurant_name: PropTypes.string,
    }),
    dish: PropTypes.shape({
      id: PropTypes.number,
      dish_name: PropTypes.string,
    }),
    category: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    })),
    // Add other properties of editObj here if needed
  }),
};

FoodLogForm.defaultProps = {
  editObj: null,
};

export default FoodLogForm2;
