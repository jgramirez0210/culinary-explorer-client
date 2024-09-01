import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';

function ItemCard({ itemObj }) {
  console.warn('this is my item object', itemObj);

  // Destructure properties from itemObj with default values
  const {
    restaurant: { restaurant_name, restaurant_address, website_url } = {},
    food_image_url = '',
    dish: { dish_name = '' } = {},
    price = 0,
    category = [],
    description = 'No description available',
    notes = 'No notes available',
  } = itemObj;

  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>
        {restaurant_name}
      </Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={food_image_url} alt={dish_name} style={{ height: '400px', borderRadius: '0.5rem' }} />
        <p style={{ textAlign: 'center' }} className="card-text bold">${price}</p>
        <p className="card-text bold">Category: {category.length > 0 ? category.map((cat) => cat.category_name).join(', ') : 'No category available'}</p>
        <p className="card-text bold">Description: {description}</p>
        <p className="card-text bold">Notes: {notes}</p>
        <p className="card-text bold">Restaurant Address: {restaurant_address}</p>
        <p className="card-text bold">Website: <a href={website_url} target="_blank" rel="noopener noreferrer">{website_url}</a></p>
        <Link href={`/view/${itemObj.id}`} passHref>
          <Button variant="outline-success" className="m-2">VIEW</Button>
        </Link>
        <Link href={`/edit/${itemObj.id}`} passHref>
          <Button variant="outline-dark" color="success">EDIT</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

ItemCard.propTypes = {
  itemObj: PropTypes.shape({
    food_image_url: PropTypes.string,
    restaurant: PropTypes.shape({
      restaurant_name: PropTypes.string,
      restaurant_address: PropTypes.string,
      website_url: PropTypes.string,
    }).isRequired,
    price: PropTypes.number,
    category: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      category_name: PropTypes.string,
    })),
    description: PropTypes.string,
    notes: PropTypes.string,
    dish: PropTypes.shape({
      dish_name: PropTypes.string,
    }).isRequired,
    id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;