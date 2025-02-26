import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import FoodLogCard from '../components/FoodLogCard';
import { getFoodLogByUser } from '../api/FoodLog';

function Home() {
  const [foodLog, setFoodLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (user) {
      const { uid } = user;
      console.warn('Making API call with UID:', uid);

      getFoodLogByUser(uid)
        .then((data) => {
          console.warn('Food logs received from API:', data);
          setFoodLog(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.warn('Error fetching food logs:', error);
          setFoodLog([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.warn('No user available, skipping food log fetch');
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = (deletedItemId) => {
    setFoodLog((prevFoodLog) => prevFoodLog.filter((item) => item.id !== deletedItemId));
  };

  // Show loading indicator while authentication is being checked
  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return <div className="alert alert-warning text-center m-5">You must be logged in to view your food logs. Please sign in.</div>;
  }

  return (
    <div>
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {Array.isArray(foodLog) && foodLog.length > 0 ? foodLog.map((item) => <FoodLogCard key={item.id} itemObj={item} onUpdate={handleUpdate} viewType="all" />) : <div className="alert alert-warning">No food logs available or there was an error loading them.</div>}
      </div>
    </div>
  );
}

export default Home;
