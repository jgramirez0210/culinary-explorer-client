import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleFoodLog } from '../../../api/FoodLog';
import FoodLogForm from '../../../components/forms/FoodLogForm';
import { useAuth } from '../../../utils/context/authContext';

export default function EditItem() {
  const [editObj, setEditObj] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      getSingleFoodLog(id).then(setEditObj);
    }
  }, [id]);

  return <FoodLogForm user={user} editObj={editObj} />;
}
