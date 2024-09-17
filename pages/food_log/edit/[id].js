import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleFoodLog } from '../../../api/FoodLog';
import FoodLogForm from '../../../components/forms/FoodLogForm';

export default function EditItem() {
  const [editObj, setEditObj] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getSingleFoodLog(id).then(setEditObj);
    }
  }, [id]);

  return <FoodLogForm editObj={editObj} />;
}