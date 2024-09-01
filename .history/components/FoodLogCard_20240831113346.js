import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';

function ItemCard({ itemObj }) {
  console.warn('this is my item object', itemObj);
  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>{itemObj.restaurant}</Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={itemObj.image_url} alt={itemObj.restaurant} style={{ height: '400px', borderRadius: '0.5rem' }} />
        <p style={{ textAlign: 'center' }} className="card-text bold">${itemObj.price}</p>
        <p className="card-text bold">{itemObj.category.category_name}</p> {/* Ensure this is the correct property */}
        <p className="card-text bold">{itemObj.description}</p>
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
    image_url: PropTypes.string,
    restaurant: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.shape({ // Update this to match the actual structure
      category_name: PropTypes.string,
    }).isRequired,
    description: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;