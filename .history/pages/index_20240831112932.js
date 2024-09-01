import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import FoodLogCard from '../components/FoodLogCard';
import { getAllFoodLogs } from '../api/FoodLog'; // Ensure this matches the export type

function Home() {
  const { user } = useAuth();
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    getAllFoodLogs().then((data) => setFoodLog(data));
  }, []);

  return (
    <div>
      {/* <h1>Hello {user.fbUser.displayName}! </h1>
      <p>Click the button below to logout!</p> */}
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {foodLog.map((item) => (
          <FoodLogCard key={item.id} itemObj={item} onUpdate={getAllFoodLogs} />
        ))}
      </div>
    </div>
  );
}

export default Home;