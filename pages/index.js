import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import FoodLogCard from '../components/FoodLogCard';
import { getFoodLogByUser } from '../api/FoodLog';
// Function Name
function Home() {
  // Variable Declarations
  const [foodLog, setFoodLog] = useState([]);
  const { user } = useAuth();
  // UseEffect (what happens when the user logs in)
  useEffect(() => {
    if (user) {
      const { uid } = user;
      console.warn('Fetching food log for user with uid:', uid);
      getFoodLogByUser(uid)
        .then((data) => {
          console.warn('Successfully fetched food log data:', data);
          setFoodLog(data);
        })
        .catch((error) => {
          console.warn('Error fetching food log:', error);
          setFoodLog([]); // Set empty array on error to prevent undefined
        });
    } else {
      console.warn('No user available, skipping food log fetch');
    }
  }, [user]);
  // Handle Update (what happens when the user updates)
  const handleUpdate = (deletedItemId) => {
    setFoodLog((prevFoodLog) => prevFoodLog.filter((item) => item.id !== deletedItemId));
  };
  // Return (what is displayed on the page)
  return (
    <div>
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {foodLog
          .filter((item) => item.uid === user.uid)
          .map((item) => (
            <FoodLogCard key={item.id} itemObj={item} onUpdate={handleUpdate} viewType="all" />
          ))}
      </div>
    </div>
  );
}
export default Home;
