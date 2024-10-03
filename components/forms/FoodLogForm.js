// Importing necessary modules and functions
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { updateFoodLog, createFoodLog } from '../../api/FoodLog';
import { getAllRestaurants } from '../../api/Restaurants';
import { getAllCategories } from '../../api/Categories';
import { getAllDishes } from '../../api/Dish';
import DishForm from './DishForm';

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
  const [showDishForm, setShowDishForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddToFoodLogForm, setShowAddToFoodLogForm] = useState(true);
  const router = useRouter();
  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (editObj) {
      setFormInput({
        restaurant_id: editObj.restaurant.id,
        dish_id: editObj.dish.id,
        category_ids: editObj.category.map((cat) => cat.id),
      });
    } else {
      setFormInput(initialState);
    }

    getAllRestaurants()
      .then((restaurants) => {
        setRestaurants(restaurants);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllDishes()
      .then((dishes) => {
        setDishes(dishes);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllCategories()
      .then((categories) => {
        setCategories(categories);
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
        .then((newFoodLog) => {
          router.push(`/food_log/${newFoodLog.id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  const handleBack = () => {
    setShowAddToFoodLogForm(true);
    setShowDishForm(false);
    setShowDropdown(false);
  };

  const handleShowDishForm = () => {
    setShowAddToFoodLogForm(false);
    setShowDishForm(true);
    setShowDropdown(false);
  };

  const handleShowRestaurantForm = () => {
    setShowAddToFoodLogForm(false);
    setShowRestaurantForm(true);
    setShowDropdown(false);
  };

  const handleShowCategoryForm = () => {
    setShowAddToFoodLogForm(false);
    setShowCategoryForm(true);
    setShowDropdown(false);
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    if (selectedValues.includes('create_new')) {
      handleShowCategoryForm();
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        category_ids: selectedValues,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 'create_new') {
      if (name === 'restaurant_id') {
        handleShowRestaurantForm();
      } else if (name === 'dish_id') {
        handleShowDishForm();
      }
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div>
      {!showDishForm ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="restaurantName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Select
              as="select"
              name="restaurant_id"
              value={formInput.restaurant_id || ''}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Select a Restaurant
              </option>
              <option value="create_new">Create New</option>
              {restaurantList.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.restaurant_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="dishName">
            <Form.Label>Dish Name</Form.Label>
            <Form.Select
              as="select"
              name="dish_id"
              value={formInput.dish_id || ''}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Select a Dish
              </option>
              <option value="create_new">Create New</option>
              {dishList.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.dish_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="categories">
            <Form.Label>Select Categories</Form.Label>
            <Select
              name="category_ids"
              value={categoryList
                .filter((cat) => Array.isArray(formInput.category_ids) && formInput.category_ids.includes(cat.id))
                .map((cat) => ({ value: cat.id, label: cat.category }))}
              options={categoryList.map((cat) => ({ value: cat.id, label: cat.category }))}
              isMulti
              onChange={handleMultiSelectChange}
              placeholder="Select a Category"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        <div>
          <DishForm user={user} />
          <Button variant="primary" onClick={handleBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};
// Prop types for the FoodLogForm component
FoodLogForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  editObj: PropTypes.shape({
    id: PropTypes.number,
    restaurant: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    dish: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    category: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      })
    ),
  }),
};

FoodLogForm.defaultProps = {
  editObj: null,
};

export default FoodLogForm;
