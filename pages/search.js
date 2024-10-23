import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import FoodLogCard from '../components/FoodLogCard';

const Search = ({ query }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      console.log('Fetching search results for:', query); // Log the query

      fetch(`/api/search?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Search results:', data); // Log the search results
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="search-results">
      {query && items.length === 0 ? (
        <p>No items found for &quot;{query}&quot;.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-evenly">
          {items.map((item) => (
            <FoodLogCard key={item.id} itemObj={item} onUpdate={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
};

Search.propTypes = {
  query: PropTypes.string.isRequired,
};

export default Search;
