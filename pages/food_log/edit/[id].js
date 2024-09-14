import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleFoodLog } from '../../../api/FoodLog';
import FoodLogForm from '../../../components/forms/FoodLogForm';

export default function EditItem() {
  const [editObj, setEditObj] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getSingleFoodLog(id)
        .then((data) => {
          console.warn('data:', data);
          setEditObj(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching food log:', err);
          setError(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading food log.</p>;

  return <FoodLogForm obj={editObj} />;
}