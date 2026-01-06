import { useState } from 'react';
import FoodLogForm from '../../components/forms/FoodLogForm';
import { useAuth } from '../../utils/context/authContext';
import { useGoogleMaps } from '../../components/GoogleMapsProvider'; // Replace useJsApiLoader

function NewGame() {
  const { user, userLoading } = useAuth();
  const { isLoaded, loadError } = useGoogleMaps();

  // Show loading while authentication is being checked
  if (userLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show sign in prompt
  if (!user) {
    return <div className="alert alert-warning text-center m-5">You must be logged in to create a food log. Please sign in.</div>;
  }

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
