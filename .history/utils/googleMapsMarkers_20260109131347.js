import React, { useState, useEffect } from 'react';
import { useGoogleMaps } from '../components/GoogleMapsProvider';
import { getAllRestaurantsByUid } from '../api/Restaurants';
import { fetchCoordinates } from '../utils/GoogleMapsScripts';
import { useAuth } from '../utils/context/authContext';
import Map from '../components/GoogleMapsCard';

const LocationFetcher = () => {
  const [locations, setLocations] = useState([]);
  const { user } = useAuth();
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    const updateLocations = async () => {
      console.log('LocationFetcher: Starting location update, user:', user);
      if (!user) {
        console.log('LocationFetcher: No user found, returning early');
        return;
      }

      try {
        console.log('LocationFetcher: Fetching restaurants for user:', user.uid);
        const restaurants = await getAllRestaurantsByUid(user.uid);
        console.log('API response restaurants:', restaurants, 'Type:', typeof restaurants, 'Is Array:', Array.isArray(restaurants));

        if (!Array.isArray(restaurants)) {
          if (restaurants && restaurants.message) {
            console.warn('No restaurants found for user:', restaurants.message);
          } else {
            console.error('Unexpected API response format:', restaurants);
          }
          setLocations([]); // Set empty array to prevent further errors
          return;
        }

        console.log('LocationFetcher: Processing', restaurants.length, 'restaurants');
        const locationPromises = restaurants.map(async (restaurant) => {
          const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
          console.log('LocationFetcher: Processing restaurant:', restaurantName, 'Address:', restaurantAddress, 'ID:', id);
          const numericId = Number(id);
          if (Number.isNaN(numericId)) {
            console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
            return null;
          }
          try {
            console.log('LocationFetcher: Fetching coordinates for:', restaurantName);
            const location = await fetchCoordinates(restaurantAddress, numericId);
            if (!location) {
              console.error(`No location found for restaurant ${restaurantName}`);
              return null;
            }
            console.log('LocationFetcher: Got coordinates for', restaurantName, ':', location);
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
            console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
            return null;
          }
        });

        const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);
        console.log('LocationFetcher: Final locations array:', updatedLocations, 'Length:', updatedLocations.length);
        setLocations(updatedLocations);
      } catch (error) {
        console.error('Error updating locations:', error);
      }
    };
    updateLocations();
  }, [user]); // Add user dependency

  if (!isLoaded) return <div>Loading...</div>;

  return <Map locations={locations} />;
};

export default LocationFetcher;
