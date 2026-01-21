import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useJsApiLoader } from '@react-google-maps/api';
import { updateFoodLog, createFoodLog } from '../../api/FoodLog';
import { getAllRestaurants, getAllRestaurantsByUid, deleteRestaurant } from '../../api/Restaurants';
import { getAllCategories } from '../../api/Categories';
import { getAllDishes, deleteDish, updateDish } from '../../api/Dish';
import DishForm from './DishForm';
import RestaurantForm from './RestaurantForm';
import DishHoverCard from '../hover cards/DishHoverCard';
import RestaurantHoverCard from '../hover cards/RestaurantHoverCard';

// Initial state for the form
const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
  description: '',
};

function FoodLogForm({ isLoaded, user, editObj = initialState }) {
  // Default Form States
  const [formInput, setFormInput] = useState(initialState);
  const [reload, setReload] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
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
  // Edit States
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  // Hover Card States
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dish, setDish] = useState(null); // eslint-disable-line no-unused-vars
  const [cardType, setCardType] = useState(null);

  // Fetch data when user or reload changes
  useEffect(() => {
    if (user && user.uid) {
      setDataLoaded(false);
      Promise.all([getAllRestaurantsByUid(user.uid), getAllDishes(), getAllCategories()])
        .then(([restaurants, dishes, categories]) => {
          setRestaurants(restaurants);
          setDishes(dishes);
          setCategories(categories);
          setDataLoaded(true);
        })
        .catch((error) => {
          setDataLoaded(true); // Still set to true to allow rendering, but with empty data
        });
    }
  }, [user, reload]);

  // Initialize or update form input when editObj or dishList changes
  useEffect(() => {
    if (editObj) {
      const selectedDish = dishList.find((dish) => dish.id === editObj.dish.id);
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        restaurant_id: editObj.restaurant.id || '',
        dish_id: editObj.dish.id || '',
        category_ids: Array.isArray(editObj.category) ? editObj.category.map((cat) => cat.id) : [],
        description: selectedDish ? selectedDish.description || '' : '',
      }));
    } else {
      setFormInput(initialState);
    }
  }, [editObj, dishList]);

  if (!isLoaded || !dataLoaded) {
    return <div>Loading...</div>;
  }
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formInput.restaurant_id || !formInput.dish_id) {
      alert('Please select both a restaurant and a dish.');
      return;
    }

    // Constructing the Food log object
    const payload = {
      category_ids: formInput.category_ids.map(Number),
      uid: user.uid,
      restaurant_id: formInput.restaurant_id,
      dish_id: formInput.dish_id,
    };

    if (id) {
      // If an id is present, update the Food log
      updateFoodLog(id, payload)
        .then(() => {
          router.push(`/food_log/${id}`);
          localStorage.setItem('dishDataLastChange', Date.now());
        })
        .catch((error) => {});
    } else {
      // Otherwise, create a new Food log
      createFoodLog(payload)
        .then((newFoodLog) => {
          router.push(`/food_log/${newFoodLog.id}`);
          localStorage.setItem('dishDataLastChange', Date.now());
        })
        .catch((error) => {});
    }

    // After food log operations, check if description changed
    const selectedDish = dishList.find((dish) => dish.id === formInput.dish_id);
    if (selectedDish && formInput.description !== selectedDish.description) {
      updateDish(formInput.dish_id, {
        ...selectedDish,
        description: formInput.description,
      }).catch((error) => {});
    }
  };

  // HANDLE EVENTS
  const handleBack = (createdOrEditedData) => {
    setShowAddToFoodLogForm(true);
    setShowRestaurantForm(false);
    setShowDishForm(false);
    setShowDropdown(false);
    setEditingRestaurant(null);
    setEditingDish(null);
    if (createdOrEditedData && createdOrEditedData.id) {
      // Check if it's a restaurant or dish
      if (createdOrEditedData.restaurant_name) {
        // It's a restaurant
        setFormInput((prevState) => ({
          ...prevState,
          restaurant_id: createdOrEditedData.id,
        }));
        // Update or add the restaurant to the list
        setRestaurants((prev) => {
          const existingIndex = prev.findIndex((r) => r.id === createdOrEditedData.id);
          if (existingIndex >= 0) {
            // Update existing
            const updated = [...prev];
            updated[existingIndex] = createdOrEditedData;
            return updated;
          } else {
            // Add new
            return [...prev, createdOrEditedData];
          }
        });
      } else if (createdOrEditedData.dish_name) {
        // It's a dish
        // Update or add the dish to the list
        setDishes((prev) => {
          const existingIndex = prev.findIndex((d) => d.id === createdOrEditedData.id);
          if (existingIndex >= 0) {
            // Update existing
            const updated = [...prev];
            updated[existingIndex] = createdOrEditedData;
            return updated;
          } else {
            // Add new
            return [...prev, createdOrEditedData];
          }
        });
        setFormInput((prevState) => ({
          ...prevState,
          dish_id: createdOrEditedData.id,
        }));
      }
    }
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
      setFormInput((prevState) => {
        const newState = {
          ...prevState,
          [name]: value,
        };

        // Populate description when dish is selected
        if (name === 'dish_id') {
          const selectedDish = dishList.find((dish) => dish.id === parseInt(value));
          if (selectedDish) {
            newState.description = selectedDish.description || '';
          }
        }

        return newState;
      });
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownClicked(true);
  };
  // // GENERATE DELETE BUTTON
  // // eslint-disable-next-line no-shadow
  // const handleDelete = (id, type) => {
  //   if (!id) {

  //     return;
  //   }
  //   const deleteFunction = type === 'restaurant' ? deleteRestaurant : deleteDish;
  //   deleteFunction(id)
  //     .then(() => {
  //       setReload((prev) => !prev);
  //     })
  //     .catch((error) => {
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
  const handleEdit = (item, type) => {
    if (type === 'restaurant') {
      setEditingRestaurant(item);
      setShowAddToFoodLogForm(false);
      setShowRestaurantForm(true);
      setShowDropdown(false);
    } else if (type === 'dish') {
      setEditingDish(item);
      setShowAddToFoodLogForm(false);
      setShowDishForm(true);
      setShowDropdown(false);
    }
  };

  const handleDelete = (id, type) => {
    const deleteFunction = type === 'restaurant' ? deleteRestaurant : deleteDish;
    deleteFunction(id).then(() => {
      if (type === 'restaurant') {
        setRestaurants((prev) => prev.filter((item) => item.id !== id));
      } else {
        setDishes((prev) => prev.filter((item) => item.id !== id));
      }
    });
  };

  const generateOptions = (list, type) => {
    // Check if list is an array before trying to map over it
    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{type === 'restaurant' ? item.restaurant_name : item.dish_name}</span>
          <div>
            <Button className="button button-edit" size="sm" onClick={() => handleEdit(item, type)} style={{ marginRight: '5px' }}>
              Edit
            </Button>
            <Button className="button button-delete" size="sm" onClick={() => handleDelete(item.id, type)}>
              Delete
            </Button>
          </div>
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
          <RestaurantForm editItem={editingRestaurant} onRestaurantCreated={handleBack} isLoaded={isLoaded} />
          <Button className="button button-view" onClick={handleBack}>
            Back
          </Button>
        </div>
      );
    }

    if (showDishForm) {
      return (
        <div>
          <DishForm editItem={editingDish} onDishCreated={handleBack} isLoaded={isLoaded} />
          <Button className="button button-view" onClick={handleBack}>
            Back
          </Button>
        </div>
      );
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

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formInput.description || ''} onChange={handleChange} placeholder="Enter dish description" />
          </Form.Group>

          <Form.Group controlId="categories">
            <Form.Label>Select Categories</Form.Label>
            {(() => {
              if (!Array.isArray(categoryList)) {
                return <Select name="category_ids" value={[]} options={[]} isMulti placeholder="Loading categories..." />;
              }
              const categoryOptions = categoryList.map((cat) => ({ value: cat.id, label: cat.category }));
              const categoryValue = categoryList.filter((cat) => Array.isArray(formInput.category_ids) && formInput.category_ids.includes(cat.id)).map((cat) => ({ value: cat.id, label: cat.category }));
              return (
                <Select
                  name="category_ids"
                  value={categoryValue}
                  options={categoryOptions}
                  isMulti
                  onMenuOpen={() => {
                    setIsDropdownOpen(true);
                    handleDropdownClick();
                  }}
                  onMenuClose={() => setIsDropdownOpen(false)}
                  onChange={handleMultiSelectChange}
                  placeholder="Select a Category"
                />
              );
            })()}
          </Form.Group>
          <Button className="button button-view" type="submit">
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
