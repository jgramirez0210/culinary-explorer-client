import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleFoodLog } from '../../../api/FoodLog';
import FoodLogForm from '../../../components/forms/FoodLogForm';
import { useAuth } from '../../../utils/context/authContext';
import { useGoogleMaps } from '../../../components/GoogleMapsProvider';

export default function EditItem() {
  const [editObj, setEditObj] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user, userLoading } = useAuth();
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (id) {
      console.log('Edit page: Fetching food log with id:', id);
      getSingleFoodLog(id)
        .then((data) => {
          console.log('Edit page: Successfully fetched food log:', data);
          setEditObj(data);
        })
        .catch((error) => {
          console.error('Edit page: Error fetching food log:', error);
        });
    } else {
      console.log('Edit page: No id yet, waiting for router.query');
    }
  }, [id]);

  // Show loading while authentication is being checked
  if (userLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show sign in prompt
  if (!user) {
    return <div className="alert alert-warning text-center m-5">You must be logged in to edit a food log. Please sign in.</div>;
  }

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <FoodLogForm user={user} isLoaded={isLoaded} editObj={editObj} />;
}
