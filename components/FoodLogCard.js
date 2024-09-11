import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function FoodLogCard({ itemObj, viewType }) {

  const categoryNames = Array.isArray(itemObj.category)
    ? itemObj.category.map((cat) => cat.category)
    : [];

  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>
        {itemObj.restaurant.restaurant_name}
      </Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={itemObj.dish.food_image_url} alt={itemObj.dish.dish_name} style={{ height: '175px', borderRadius: '0.5rem' }} />
        <p className="card-text bold">Category: {categoryNames.join(', ')}</p>
        <p className="card-text bold">Dish Name: {itemObj.dish.dish_name}</p>
        
        {viewType === 'single' && (
          <>
            <p className="card-text bold">Restaurant Address: {itemObj.restaurant.restaurant_address}</p>
            <p className="card-text">
              Website: <a href={itemObj.restaurant.website_url} target="_blank" rel="noopener noreferrer">{itemObj.restaurant.website_url}</a>
            </p>
            <p className="card-text bold">Notes: {itemObj.dish.notes}</p>
          </>
        )}
        {viewType === 'all' && (
          <>
            <p className="card-text bold">Short Description: {itemObj.dish.description}</p>
            <p style={{ textAlign: 'center' }} className="card-text bold">${itemObj.dish.price}</p>
          </>
        )}
        <Link href={`/food_log/${itemObj.id}`} passHref>
          <Button variant="outline-success" className="m-2">VIEW</Button>
        </Link>
        <Link href={`/edit/${itemObj.id}`} passHref>
          <Button variant="outline-dark" color="success">EDIT</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

FoodLogCard.propTypes = {
  itemObj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    restaurant_name: PropTypes.string.isRequired,
    dish: PropTypes.shape({
      food_image_url: PropTypes.string.isRequired,
      dish_name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      notes: PropTypes.string,
      short_description: PropTypes.string,
    }).isRequired,
    category: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string.isRequired,
      })
    ),
    restaurant: PropTypes.shape({
      restaurant_address: PropTypes.string,
      website_url: PropTypes.string,
    }),
  }).isRequired,
  viewType: PropTypes.oneOf(['single', 'all']).isRequired,
};

export default FoodLogCard;