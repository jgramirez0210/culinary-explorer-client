import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { deleteItem } from '../api/FoodLog';

function FoodLogCard({ itemObj, viewType, onUpdate }) {
  const router = useRouter();
  const categoryNames = Array.isArray(itemObj.category) ? itemObj.category.map((cat) => cat.category) : [];

  const deleteThisItem = (itemId) => {
    if (window.confirm('Delete Entry?')) {
      deleteItem(itemId).then(() => {
        onUpdate();
        router.push('/'); // Navigate to the home page
      });
    }
  };

  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>{itemObj.restaurant?.restaurant_name}</Card.Title>
      <Card.Body className="card-body">
        <Card.Img variant="top" src={itemObj.dish?.food_image_url} alt={itemObj.dish?.dish_name} style={{ height: '175px', borderRadius: '0.5rem' }} />
        <div className="card-text">
          <label htmlFor="dishName">Dish Name:</label>
          <span id="dishName">{itemObj.dish?.dish_name}</span>
        </div>
        <p className="card-text">
          <label htmlFor="category">Category:</label>
          <span id="category">{categoryNames.join(', ')}</span>
        </p>

        {viewType === 'single' && (
          <>
            <p className="card-text">
              <label htmlFor="description">Description: </label>
              <span id="description">{itemObj.dish?.description}</span>
            </p>
            <p className="card-text">
              <label htmlFor="notes">Notes: </label>
              <span id="notes">{itemObj.dish?.notes}</span>
            </p>
            <p className="card-text">
              <label htmlFor="price">Price: </label>
              <span id="price">${itemObj.dish?.price}</span>
            </p>
            <p className="card-text">
              <label htmlFor="restaurant-address">Restaurant Address: </label>
              <span id="restaurant-address">{itemObj.restaurant?.restaurant_address}</span>
            </p>
            <a href={itemObj.restaurant?.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
              Website
            </a>
            <p className="card-text">
              <label htmlFor="notes">Notes: </label>
              <span id="notes">{itemObj.dish?.notes}</span>
            </p>
            <Link href={`/food_log/edit/${itemObj.id}`} passHref>
              <Button variant="outline-dark" color="success">
                EDIT
              </Button>
            </Link>
            <Button variant="outline-danger" onClick={deleteThisItem} className="m-2">
              DELETE
            </Button>
          </>
        )}
        {viewType === 'all' && (
          <>
            <p className="card-text bold">
              <label htmlFor="short-description">Short Description: </label>
              <span id="short-description">{itemObj.dish.description}</span>
            </p>
            <Link href={`/food_log/${itemObj.id}`} passHref>
              <Button variant="outline-success" className="m-2 view-button">
                VIEW
              </Button>
            </Link>
          </>
        )}

      </Card.Body>
    </Card>
  );
}

FoodLogCard.propTypes = {
  itemObj: PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
      }),
    ),
    restaurant: PropTypes.shape({
      restaurant_name: PropTypes.string,
      restaurant_address: PropTypes.string,
      website_url: PropTypes.string,
    }),
    dish: PropTypes.shape({
      food_image_url: PropTypes.string,
      dish_name: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.string,
      notes: PropTypes.string,
    }),
  }).isRequired,
  viewType: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default FoodLogCard;
