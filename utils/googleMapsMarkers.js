import React, { useState, useEffect } from 'react';
import { useGoogleMaps } from '../components/GoogleMapsProvider';
import { getAllRestaurantsByUid } from '../api/Restaurants';
import { fetchCoordinates } from '../utils/GoogleMapsScripts';
import { useAuth } from '../utils/context/authContext';
import Map from '../components/GoogleMapsCard';

const LocationFetcher = ({ restaurants: propRestaurants }) => {
  const [locations, setLocations] = useState([]);
  const { user } = useAuth();
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    const updateLocations = async () => {
      // Temporarily bypass user check for testing
      // if (!user) {
      //   console.log('LocationFetcher: No user found, returning early');
      //   return;
      // }

      try {
        let restaurants;
        if (propRestaurants && propRestaurants.length > 0) {
          restaurants = propRestaurants;
        } else {
          // Use test data if no propRestaurants or user not logged in
          restaurants = [
            {
              id: 1,
              restaurant_name: 'Test Restaurant 1',
              restaurant_address: '123 Main St, Houston, TX',
            },
            {
              id: 2,
              restaurant_name: 'Test Restaurant 2',
              restaurant_address: '456 Oak St, Houston, TX',
            },
          ];
        }

        if (!Array.isArray(restaurants)) {
          if (restaurants && restaurants.message) {
          } else {
          }
          setLocations([]); // Set empty array to prevent further errors
          return;
        }

        const locationPromises = restaurants.map(async (restaurant) => {
          const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
          const numericId = Number(id);
          if (Number.isNaN(numericId)) {
            return null;
          }
          try {
            const location = await fetchCoordinates(restaurantAddress, numericId);
            if (!location) {
              return null;
            }
            return {
              id: numericId,
              location: {
                lat: location.lat,
                lng: location.lng,
              },
              restaurantName,
              restaurantAddress,
            };
          } catch (error) {
            return null;
          }
        });

        const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);
        setLocations(updatedLocations);
      } catch (error) {}
    };
    updateLocations();
  }, [user, propRestaurants]); // Add user and propRestaurants dependency

  if (!isLoaded) return <div>Loading...</div>;

  return <Map locations={locations} />;
};

export default LocationFetcher;
