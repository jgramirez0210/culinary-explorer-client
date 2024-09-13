import { useState, useEffect } from 'react';
import FoodLogCard from '../components/FoodLogCard';
import { getAllFoodLogs } from '../api/FoodLog';

function Home() {
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    getAllFoodLogs().then((data) => setFoodLog(data));
  }, []);

  const handleUpdate = (deletedItemId) => {
    setFoodLog((prevFoodLog) => prevFoodLog.filter(item => item.id !== deletedItemId));
  };

  return (
    <div>
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {foodLog.map((item) => (
          <FoodLogCard key={item.id} itemObj={item} onUpdate={handleUpdate} viewType="all" />
        ))}
      </div>
    </div>
  );
}

export default Home;