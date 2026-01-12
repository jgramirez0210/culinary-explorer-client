import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import FoodLogCard from '../components/FoodLogCard';
import { getFoodLogByUser } from '../api/FoodLog';
import LocationFetcher from '../utils/googleMapsMarkers';

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

  // Extract unique restaurants from food logs
  const restaurants = Array.isArray(foodLog) ? [...new Map(foodLog.map((item) => [item.restaurant.id, item.restaurant])).values()] : [];
  console.log('Index: Extracted restaurants from food logs:', restaurants, 'Length:', restaurants.length);

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
    <div className="page-container">
      <div className="card-grid">{Array.isArray(foodLog) && foodLog.length > 0 ? foodLog.map((item) => <FoodLogCard key={item.id} itemObj={item} onUpdate={handleUpdate} viewType="all" />) : <div className="card">No food logs available or there was an error loading them.</div>}</div>
      <LocationFetcher restaurants={restaurants} />
    </div>
  );
}

export default Home;
