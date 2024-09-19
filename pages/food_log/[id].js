import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FoodLogCard from '../../components/FoodLogCard';
import { getSingleFoodLog } from '../../api/FoodLog';

const ViewSingleFoodLog = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    let isMounted = true;

    if (id) {
      getSingleFoodLog(id).then((fetchedData) => {
        if (isMounted) {
          setData(fetchedData);
        }
      }).catch(() => {
        // Handle error if needed
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdate = (updatedId) => {
    let isMounted = true;

    getSingleFoodLog(updatedId).then((fetchedData) => {
      if (isMounted) {
        setData(fetchedData);
      }
    }).catch(() => {
      // Handle error if needed
    });

    return () => {
      isMounted = false;
    };
  };

  return (
    <>
      {data ? (
        <FoodLogCard itemObj={data} viewType="single" onUpdate={handleUpdate} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ViewSingleFoodLog;
