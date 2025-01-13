import { useState, useEffect } from 'react';
import { useAuth } from '../utils/context/authContext';
import FoodLogCard from '../components/FoodLogCard';
import { getFoodLogByUser } from '../api/FoodLog';

function Home() {
  const [foodLog, setFoodLog] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const { uid } = user;
      getFoodLogByUser(uid).then((data) => {
        setFoodLog(data);
      }).catch((error) => {
        console.error('Error fetching food log:', error);
      });
    }
  }, [user]);
  // console.warn(user.email_address);
  const handleUpdate = (deletedItemId) => {
    setFoodLog((prevFoodLog) => prevFoodLog.filter((item) => item.id !== deletedItemId));
  };

  return (
    <div>
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {foodLog.filter((item) => item.uid === user.uid).map((item) => (
          <FoodLogCard key={item.id} itemObj={item} onUpdate={handleUpdate} viewType="all" />
        ))}
      </div>
    </div>
  );
}
export default Home;
