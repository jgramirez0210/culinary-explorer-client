import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/context/authContext';
import LocationFetcher from '../../utils/googleMapsMarkers';
import { getFoodLogByUser } from '../../api/FoodLog';

const RestaurantMapCard = () => {
  const [foodLog, setFoodLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (user) {
      const { uid } = user;
      console.warn('RestaurantMap: Making API call with UID:', uid);

      getFoodLogByUser(uid)
        .then((data) => {
          console.warn('RestaurantMap: Food logs received from API:', data);
          setFoodLog(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.warn('RestaurantMap: Error fetching food logs:', error);
          setFoodLog([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.warn('RestaurantMap: No user available, skipping food log fetch');
      setLoading(false);
    }
  }, [user]);

  // Extract unique restaurants from food logs
  const restaurants = Array.isArray(foodLog) ? [...new Map(foodLog.map((item) => [item.restaurant.id, item.restaurant])).values()] : [];
  console.log('RestaurantMap: Extracted restaurants from food logs:', restaurants, 'Length:', restaurants.length);

  // Show loading indicator while authentication is being checked
  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  // Temporarily bypass login check for testing
  // If not logged in, show login prompt
  // if (!user) {
  //   return <div className="alert alert-warning text-center m-5">You must be logged in to view the restaurant map. Please sign in.</div>;
  // }

  return (
    <div className="page-container">
      <LocationFetcher restaurants={restaurants} />
    </div>
  );
};

export default RestaurantMapCard;
