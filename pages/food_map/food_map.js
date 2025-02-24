// food_map.js
import React from 'react';
import { useAuth } from '../../utils/context/authContext';
import GoogleMapsCard from '../../components/GoogleMapsCard';

const FoodMap = () => {
  const { user } = useAuth(); // or however you're getting the current user

  return <GoogleMapsCard currentUser={user} />;
};

export default FoodMap;
