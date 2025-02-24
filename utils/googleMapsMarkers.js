import { useEffect } from 'react';
import { getFoodLogByUser } from '../api/FoodLog.js';
import { fetchCoordinates } from './GoogleMapsScripts.js';

const LocationFetcher = ({ isLoaded, onLocationsFetched, currentUser }) => {
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const foodLogs = await getFoodLogByUser(currentUser?.uid);
        console.warn('getFoodLogByUser Response:', {
          fullResponse: foodLogs,
          type: typeof foodLogs,
          isArray: Array.isArray(foodLogs),
          length: foodLogs?.length,
          firstItem: foodLogs?.[0],
          restaurantData: foodLogs?.[0]?.restaurant,
        });

        if (!Array.isArray(foodLogs) || foodLogs.length === 0) {
          onLocationsFetched([]);
          return;
        }

        const locations = await Promise.all(
          foodLogs.map(async (log) => {
            try {
              const restaurant = log.restaurant;

              if (!restaurant || !restaurant.restaurant_name || !restaurant.restaurant_address) {
                console.warn('Missing restaurant data:', { log });
                return null;
              }

              const coordinates = await fetchCoordinates(restaurant.restaurant_address);

              if (!coordinates) {
                console.warn(`Geocoding failed for ${restaurant.restaurant_name}`);
                return null;
              }

              return {
                ...log,
                coordinates,
              };
            } catch (error) {
              console.warn(`Error processing location:`, error);
              return null;
            }
          }),
        );

        const validLocations = locations.filter(Boolean);
        console.warn('Final locations being sent:', validLocations);
        onLocationsFetched(validLocations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        onLocationsFetched([]);
      }
    };

    if (isLoaded && currentUser?.uid) {
      fetchLocations();
    }
  }, [isLoaded, onLocationsFetched, currentUser]);

  return null;
};

export default LocationFetcher;
