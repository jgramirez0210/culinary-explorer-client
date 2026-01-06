import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useJsApiLoader } from '@react-google-maps/api';
import { updateFoodLog, createFoodLog } from '../../api/FoodLog';
import { getAllRestaurants, deleteRestaurant } from '../../api/Restaurants';
import { getAllCategories } from '../../api/Categories';
import { getAllDishes, deleteDish } from '../../api/Dish';
import DishForm from './DishForm';
import RestaurantForm from './RestaurantForm';
import DishHoverCard from '../hover cards/DishHoverCard';
import RestaurantHoverCard from '../hover cards/RestaurantHoverCard';

// Initial state for the form
const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
};

function FoodLogForm({ isLoaded, user, editObj = initialState }) {
  // Default Form States
  const [formInput, setFormInput] = useState(initialState);
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const { query } = useRouter();
  const { id } = query;
  // Form Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // eslint-disable-line no-unused-vars
  const [restaurantList, setRestaurants] = useState([]);
  const [dishList, setDishes] = useState([]);
  const [categoryList, setCategories] = useState([]);
  // Form Switching States
  const [showDishForm, setShowDishForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false); // eslint-disable-line no-unused-vars
  const [showAddToFoodLogForm, setShowAddToFoodLogForm] = useState(true); // eslint-disable-line no-unused-vars
  // Hover Card States
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dish, setDish] = useState(null); // eslint-disable-line no-unused-vars
  const [cardType, setCardType] = useState(null);

  // load Google Maps Script Asynchronously
  useEffect(() => {
    if (editObj) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        restaurant_id: editObj.restaurant.id || '',
        dish_id: editObj.dish.id || '',
        category_ids: Array.isArray(editObj.category) ? editObj.category.map((cat) => cat.id) : [],
      }));
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
        console.log('Fetched categories:', categories, typeof categories, Array.isArray(categories));
        setCategories(categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [editObj]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
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

  // HANDLE EVENTS
  const handleBack = () => {
    setShowAddToFoodLogForm(true);
    setShowRestaurantForm(false);
    setShowDishForm(false);
    setShowDropdown(false);
    setReload(!reload);
  };

  const handleShowDishForm = () => {
    setShowAddToFoodLogForm(false);
    setShowDishForm(true);
    setShowDropdown(false);
  };

  const handleShowRestaurantForm = () => {
    setShowAddToFoodLogForm(false);
    setShowRestaurantForm(true);
    setShowDishForm(false);
    setShowDropdown(false);
  };

  const handleShowCategoryForm = () => {
    setShowAddToFoodLogForm(false);
    setShowCategoryForm(true);
    setShowDropdown(false);
  };

  const determineType = (item) => {
    if (item.dish_name) {
      return 'dish';
    }
    if (item.restaurant_name) {
      return 'restaurant';
    }
    return 'unknown';
  };

  const handleMouseEnter = (item) => {
    const type = determineType(item);
    setHoveredItem(item);
    setHoveredItemId(item.id);
    setCardType(type);
  };

  const handleDropdownMouseLeave = () => {
    // Add a delay before hiding the hover card
    setTimeout(() => {
      if (!hoveredItemId) {
        setHoveredItem(null);
        setHoveredItemId(null);
        setCardType(null);
      }
    }, 300); // Adjust the delay as needed
  };

  const handleMouseMove = (e) => {
    if (hoveredItemId && !isDropdownOpen) {
      // Add a condition to check if the dropdown is open
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
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
  // HANDEL WHAT HAPPENS WHEN SOMETHING CHANGES
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

  const handleDropdownClick = () => {
    setIsDropdownClicked(true);
  };
  // // GENERATE DELETE BUTTON
  // // eslint-disable-next-line no-shadow
  // const handleDelete = (id, type) => {
  //   if (!id) {
  //     console.error('Cannot delete item: id is undefined');
  //     return;
  //   }
  //   const deleteFunction = type === 'restaurant' ? deleteRestaurant : deleteDish;
  //   deleteFunction(id)
  //     .then(() => {
  //       setReload((prev) => !prev);
  //     })
  //     .catch((error) => {
  //       console.error(`Error deleting ${type} with id: ${id}`, error);
  //     });
  // };

  // // Generate delete button for dropdown lists
  // const generateOptions = (list, type) => list.map((item) => ({
  //   value: item.id,
  //   label: (
  //     <div
  //       style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
  //       onMouseEnter={() => handleMouseEnter(item)}
  //       onMouseLeave={() => handleDropdownMouseLeave(item)}
  //     >
  //       <span>{type === 'restaurant' ? item.restaurant_name : item.dish_name}</span>
  //       <Button
  //         variant="danger"
  //         size="sm"
  //         onClick={() => handleDelete(item.id, type)}
  //         style={{ marginLeft: '10px' }}
  //       >
  //         Delete
  //       </Button>
  //     </div>
  //   ),
  // }));
  const handleDelete = (id, type) => {
    const deleteFunction = type === 'restaurant' ? deleteRestaurant : deleteDish;
    deleteFunction(id)
      .then(() => {
        if (type === 'restaurant') {
          setRestaurants((prev) => prev.filter((item) => item.id !== id));
        } else {
          setDishes((prev) => prev.filter((item) => item.id !== id));
        }
      })
      .catch(console.error);
  };

  const generateOptions = (list, type) => {
    // Check if list is an array before trying to map over it
    if (!Array.isArray(list)) {
      console.warn(`List for ${type} is not an array:`, list);
      return [];
    }

    return list.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{type === 'restaurant' ? item.restaurant_name : item.dish_name}</span>
          <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, type)}>
            Delete
          </Button>
        </div>
      ),
    }));
  };

  const restaurantOptions = generateOptions(restaurantList, 'restaurant');
  const dishOptions = generateOptions(dishList, 'dish');

  const renderForm = () => {
    if (showRestaurantForm) {
      return (
        <div>
          <RestaurantForm user={user} onRestaurantCreated={handleSubmit} isLoaded={isLoaded} />
          <Button variant="primary" onClick={handleBack}>
            Back
          </Button>
        </div>
      );
    }

    if (showDishForm) {
      return (
        <div>
          <DishForm user={user} onDishCreated={handleSubmit} isLoaded={isLoaded} />
          <Button variant="primary" onClick={handleBack}>
            Back
          </Button>
        </div>
      );
    }

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div onMouseEnter={(item) => handleMouseEnter(item)} onMouseLeave={handleDropdownMouseLeave} onMouseMove={handleMouseMove}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="restaurant">
            <Form.Label>Restaurant</Form.Label>
            <Select
              name="restaurant_id"
              data-type="restaurant"
              value={restaurantOptions.find((option) => option.value === formInput.restaurant_id) || ''}
              onChange={(selectedOption) => handleChange({ target: { name: 'restaurant_id', value: selectedOption.value } })}
              onMenuOpen={() => {
                setIsDropdownOpen(true);
                handleDropdownClick();
              }}
              onMenuClose={() => setIsDropdownClicked(false)}
              options={[{ value: 'create_new', label: 'Create New' }, ...restaurantOptions]}
              placeholder="Select a Restaurant"
            />
          </Form.Group>

          <Form.Group controlId="dish">
            <Form.Label>Dish Name</Form.Label>
            <Select
              name="dish_id"
              data-type="dish"
              value={dishOptions.find((option) => option.value === formInput.dish_id) || ''}
              onChange={(selectedOption) => handleChange({ target: { name: 'dish_id', value: selectedOption.value } })}
              onMenuOpen={() => {
                setIsDropdownOpen(true);
                handleDropdownClick();
              }}
              onMenuClose={() => setIsDropdownOpen(false)}
              options={[{ value: 'create_new', label: 'Create New' }, ...dishOptions]}
              placeholder="Select a Dish"
            />
          </Form.Group>

          <Form.Group controlId="categories">
            <Form.Label>Select Categories</Form.Label>
            {console.log('Rendering categories, categoryList:', categoryList, typeof categoryList, Array.isArray(categoryList))}
            <Select
              name="category_ids"
              value={categoryList.filter((cat) => Array.isArray(formInput.category_ids) && formInput.category_ids.includes(cat.id)).map((cat) => ({ value: cat.id, label: cat.category }))}
              options={categoryList.map((cat) => ({ value: cat.id, label: cat.category }))}
              isMulti
              onMenuOpen={() => {
                setIsDropdownOpen(true);
                handleDropdownClick();
              }}
              onMenuClose={() => setIsDropdownOpen(false)}
              onChange={handleMultiSelectChange}
              placeholder="Select a Category"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {isDropdownClicked && cardType === 'dish' && <DishHoverCard item={hoveredItem} position={mousePosition} />}
        {isDropdownClicked && cardType === 'restaurant' && <RestaurantHoverCard item={hoveredItem} position={mousePosition} />}
      </div>
    );
  };

  return <div>{renderForm()}</div>;
}

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
      }),
    ),
  }),
};

export default FoodLogForm;
