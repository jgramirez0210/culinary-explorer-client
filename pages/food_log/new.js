import { useState } from 'react';
import FoodLogForm from '../../components/forms/FoodLogForm';
import { useAuth } from '../../utils/context/authContext';
import { useJsApiLoader } from '@react-google-maps/api';
const libraries = ['places'];

function NewGame() {
  const { user } = useAuth();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  return (
    <div>
      <FoodLogForm user={user} isLoaded={isLoaded} />
    </div>
  );
}

export default NewGame;
