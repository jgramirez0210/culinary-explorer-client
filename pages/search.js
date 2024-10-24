import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import FoodLogCard from '../components/FoodLogCard';
import { searchItems } from '../api/FoodLog';

const Search = () => {
  const router = useRouter();
  const { query } = router.query;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchItems(query)
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => {
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

export default Search;
