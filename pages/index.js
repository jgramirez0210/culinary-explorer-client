import { useState, useEffect } from 'react';
import FoodLogCard from '../components/FoodLogCard';
import { getAllFoodLogs } from '../api/FoodLog';

function Home() {
  // const { user } = useAuth();
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    getAllFoodLogs().then((data) => setFoodLog(data));
  }, []);

  return (
    <div>
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {foodLog.map((item) => (
          <FoodLogCard key={item.id} itemObj={item} onUpdate={getAllFoodLogs} viewType="all" />
        ))}
      </div>
    </div>
  );
}

export default Home;
