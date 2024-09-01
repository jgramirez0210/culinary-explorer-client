import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';

function ItemCard({ itemObj }) {
  console.warn('this is my item object', itemObj);

  // Extract category names from the food_log_category join table
  const categoryNames = itemObj.food_log_category.map((flc) => flc.category.category_name);

  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>
        {itemObj.restaurant.restaurant_name}
      </Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={itemObj.food_image_url} alt={itemObj.dish.dish_name} style={{ height: '400px', borderRadius: '0.5rem' }} />
        <p style={{ textAlign: 'center' }} className="card-text bold">${itemObj.price}</p>
        <p className="card-text bold">Category: {categoryNames.join(', ')}</p>
        <p className="card-text bold">Description: {itemObj.description}</p>
        <p className="card-text bold">Notes: {itemObj.notes}</p>
        <p className="card-text bold">Restaurant Address: {itemObj.restaurant.restaurant_address}</p>
        <p className="card-text bold">Website: <a href={itemObj.restaurant.website_url} target="_blank" rel="noopener noreferrer">{itemObj.restaurant.website_url}</a></p>
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
    food_log_category: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.shape({
          category_name: PropTypes.string,
        }).isRequired,
      }),
    ).isRequired,
    description: PropTypes.string,
    notes: PropTypes.string,
    dish: PropTypes.shape({
      dish_name: PropTypes.string,
    }).isRequired,
    id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
