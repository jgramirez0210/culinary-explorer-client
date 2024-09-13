import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FoodLogCard from '../../components/FoodLogCard';
import { getSingleFoodLog } from '../../api/FoodLog';

const ViewSingleFoodLog = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getSingleFoodLog(id).then((fetchedData) => {
        setData(fetchedData);
      }).catch(() => {
        // Handle error if needed
      });
    }
  }, [id]);

  return (
    <>
      {data ? (
        <FoodLogCard itemObj={data} viewType="single" />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ViewSingleFoodLog;
