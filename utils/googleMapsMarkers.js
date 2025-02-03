import { useEffect } from 'react';
import { getAllRestaurants } from '../api/Restaurants.js';
import { fetchCoordinates } from '../utils/GoogleMapsScripts.js'; // Import fetchCoordinates

const LocationFetcher = ({ isLoaded, onLocationsFetched }) => {
  useEffect(() => {
    const fetchLocations = async () => {
      const restaurants = await getAllRestaurants();
      const locations = await Promise.all(
        restaurants.map(async (restaurant) => {
          const coordinates = await fetchCoordinates(restaurant.restaurant_address, restaurant.id); // Pass address and restaurant id
          return { ...restaurant, coordinates };
        }),
      );
      onLocationsFetched(locations);
    };

    if (isLoaded) {
      fetchLocations();
    }
  }, [isLoaded, onLocationsFetched]);

  return null;
};

export default LocationFetcher;
