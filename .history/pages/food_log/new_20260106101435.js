import { useState } from 'react';
import FoodLogForm from '../../components/forms/FoodLogForm';
import { useAuth } from '../../utils/context/authContext';
import { useGoogleMaps } from '../../components/GoogleMapsProvider'; // Replace useJsApiLoader

function NewGame() {
  const { user } = useAuth();
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FoodLogForm user={user} isLoaded={isLoaded} />
    </div>
  );
}

export default NewGame;
