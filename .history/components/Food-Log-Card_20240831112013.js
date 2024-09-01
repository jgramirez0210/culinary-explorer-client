import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
// import { deleteItem } from '../api/itemData';

function ItemCard({ itemObj }) {
  console.warn('this is my item object', itemObj);
  return (
    <Card className="card" style={{ width: '18rem', margin: '10px', border: '1px solid' }}>
      <Card.Title style={{ textAlign: 'center', paddingTop: '10px' }}>{itemObj.item_name}</Card.Title>
      <Card.Body>
        <Card.Img variant="top" src={itemObj.image_url} alt={itemObj.item_name} style={{ height: '400px', borderRadius: '0.5rem' }} />
        <p style={{ textAlign: 'center' }} className="card-text bold">${itemObj.price}</p>
        <p className="card-text bold">{itemObj.category.category_name}</p>
        <p className="card-text bold">{itemObj.description}</p>
        <Link Link href={`/view/${itemObj.id}`} passHref>
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
    item_name: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.number,
    description: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
