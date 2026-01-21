import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { searchItems } from '../api/FoodLog';
import { useAuth } from '../utils/context/authContext';
import Loading from '../components/Loading';
import FoodLogCard from '../components/FoodLogCard';

const Search = () => {
  const router = useRouter();
  const { query } = router.query;
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query && user) {
      searchItems(query, user.uid)
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
  }, [query, user]);

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
              <FoodLogCard key={item.id} itemObj={item} viewType="all" onClick={() => handleItemClick(item.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
