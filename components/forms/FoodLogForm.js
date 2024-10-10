import { useRouter } from 'next/router';
import ReactHover, { Trigger, Hover } from 'react-hover';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { updateFoodLog, createFoodLog } from '../../api/FoodLog';
import { getAllRestaurants, deleteRestaurant } from '../../api/Restaurants';
import { getAllCategories } from '../../api/Categories';
import { getAllDishes, deleteDish } from '../../api/Dish';
import DishForm from './DishForm';
import RestaurantForm from './RestaurantForm';
import setShowDishHoverCard from '../dishHoverCard';
import DishHoverCard from '../dishHoverCard';
import RestaurantHoverCard from '../RestaurantHoverCard';

// Initial state for the form
const initialState = {
  restaurant: '',
  dish: '',
  category_ids: [],
};

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 20,
  shiftY: 0,
};

function FoodLogForm({ user, editObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [restaurantList, setRestaurants] = useState([]);
  const [dishList, setDishes] = useState([]);
  const [categoryList, setCategories] = useState([]);
  const [showDishForm, setShowDishForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false); // eslint-disable-line no-unused-vars
  const [showCategoryForm, setShowCategoryForm] = useState(false); // eslint-disable-line no-unused-vars
  const [showDropdown, setShowDropdown] = useState(false); // eslint-disable-line no-unused-vars
  const [showAddToFoodLogForm, setShowAddToFoodLogForm] = useState(true); // eslint-disable-line no-unused-vars
  const [selectedType, setSelectedType] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dish, setDish] = useState(null);
  const [showDishHoverCard, setShowDishHoverCard] = useState(false);
  const [showRestaurantHoverCard, setShowRestaurantHoverCard] = useState(false);
  const [cardType, setCardType] = useState(null); 
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (editObj) {
      setFormInput({
        restaurant: editObj.restaurant.id || '',
        dish: editObj.dish.id || '',
        category_ids: Array.isArray(editObj.category) ? editObj.category.map((cat) => cat.id) : [],
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

  // HANDEL EVENTS
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
  // const handleMouseEnter = (item, type) => {
  //   console.warn('item', item);
  //   console.warn('Type', type);
  //   if (item.type === 'dish') {
  //     setDish(item);
  //     setHoveredItem(item);
  //     setShowDishHoverCard(true);
  //   } else if (item.type === 'restaurant') {
  //     setRestaurant(item);
  //     setHoveredItem(item);
  //     setShowRestaurantHoverCard(true);
  //   }
  // };

  // const handleMouseLeave = () => {
  //   setHoveredItem(null);
  //   setShowDishHoverCard(false);
  //   setShowRestaurantHoverCard(false);
  // };
  const determineType = (item) => {
    // Example logic to determine the type based on item properties
    if (item.dish_name) {
      return 'dish';
    } else if (item.restaurant_name) {
      return 'restaurant';
    }
    return 'unknown'; // Default type if none match
  };
  
  const handleMouseEnter = (item) => {
    const type = determineType(item); // Pass the item object here
    console.warn('item', item);
    console.warn('Type', type);
    setHoveredItem(item);
    setCardType(type); // Ensure type is set correctly
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
    setCardType(null); // Reset the card type
  };
  
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
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
  const handleDelete = (type) => {
    const deleteFunction = type === 'restaurant' ? deleteRestaurant : deleteDish;

    deleteFunction(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        console.error(`Error deleting ${type} with id: ${id}`, error); // Debugging log
      });
  };

  const generateOptions = (list, type) =>
    list.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={handleMouseLeave}>
          <span>{type === 'restaurant' ? item.restaurant_name : item.dish_name}</span>
          <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, type)} style={{ marginLeft: '10px' }}>
            Delete
          </Button>
        </div>
      ),
    }));

  const restaurantOptions = generateOptions(restaurantList, 'restaurant');
  const dishOptions = generateOptions(dishList, 'dish');

  const renderForm = () => {
    if (showRestaurantForm || showDishForm) {
      return (
        <div>
          {showRestaurantForm && <RestaurantForm user={user} onRestaurantCreated={handleSubmit} />}
          {showDishForm && <DishForm user={user} onDishCreated={handleSubmit} />}
          <Button variant="primary" onClick={handleBack}>
            Back
          </Button>
        </div>
      );
    }

    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="restaurant">
            <Form.Label>Restaurant</Form.Label>
            <Select name="restaurant_id" data-type="restaurant" value={restaurantOptions.find((option) => option.value === formInput.restaurant_id) || ''} onChange={(selectedOption) => handleChange({ target: { name: 'restaurant_id', value: selectedOption.value } })} options={[{ value: 'create_new', label: 'Create New' }, ...restaurantOptions]} placeholder="Select a Restaurant" />
          </Form.Group>

          <Form.Group controlId="dish">
            <Form.Label>Dish Name</Form.Label>
            <Select onMouseEnter={() => handleMouseEnter(dish, 'dish')} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} name="dish_id" data-type="dish" value={dishOptions.find((option) => option.value === formInput.dish_id) || ''} onChange={(selectedOption) => handleChange({ target: { name: 'dish_id', value: selectedOption.value } })} options={[{ value: 'create_new', label: 'Create New' }, ...dishOptions]} placeholder="Select a Dish" />
          </Form.Group>

          <Form.Group controlId="categories">
            <Form.Label>Select Categories</Form.Label>
            <Select name="category_ids" value={categoryList.filter((cat) => Array.isArray(formInput.category_ids) && formInput.category_ids.includes(cat.id)).map((cat) => ({ value: cat.id, label: cat.category }))} options={categoryList.map((cat) => ({ value: cat.id, label: cat.category }))} isMulti onChange={handleMultiSelectChange} placeholder="Select a Category" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        {cardType === 'dish' && (
        <DishHoverCard item={hoveredItem} position={mousePosition} />
      )}
      {cardType === 'restaurant' && (
        <RestaurantHoverCard item={hoveredItem} position={mousePosition} />
      )}
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
      })
    ),
  }),
};
FoodLogForm.defaultProps = {
  editObj: initialState,
};
export default FoodLogForm;
