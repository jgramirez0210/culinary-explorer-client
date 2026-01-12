import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { searchItems } from '../api/FoodLog';
import Loading from '../components/Loading';
import FoodLogCard from '../components/FoodLogCard';

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

  const handleItemClick = (id) => {
    router.push(`/food_log/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="search-results">
        {query && items.length === 0 ? (
          <div className="card">No items found for &quot;{query}&quot;.</div>
        ) : (
          <div className="card-grid">
            {items.map((item) => (
              <FoodLogCard key={item.id} itemObj={item} onClick={() => handleItemClick(item.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
