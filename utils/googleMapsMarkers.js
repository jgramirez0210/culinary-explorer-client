import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { getAllRestaurants } from '../api/Restaurants';
import { fetchCoordinates } from '../utils/GoogleMapsScripts';
import Map from '../components/GoogleMapsCard';

const LocationFetcher = () => {
  const [locations, setLocations] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const updateLocations = async () => {
      try {
        const restaurants = await getAllRestaurants();

        const locationPromises = restaurants.map(async (restaurant) => {
          const { restaurant_name: restaurantName, restaurant_address: restaurantAddress, id } = restaurant;
          const numericId = Number(id);
          if (Number.isNaN(numericId)) {
            console.error(`Invalid id for restaurant ${restaurantName}: ${id}`);
            return null;
          }
          try {
            const location = await fetchCoordinates(restaurantAddress, numericId);
            if (!location) {
              console.error(`No location found for restaurant ${restaurantName}`);
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
            console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
            return null;
          }
        });

        const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);
        console.log('Updated locations:', updatedLocations);
        setLocations(updatedLocations);
      } catch (error) {
        console.error('Error updating locations:', error);
      }
    };

    updateLocations();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return <Map locations={locations} />;
};

export default LocationFetcher;
