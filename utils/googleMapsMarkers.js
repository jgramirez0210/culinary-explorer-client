import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { getAllRestaurants } from '../api/Restaurants';
import fetchCoordinates from './GoogleMapsScripts';
import Map from '../components/GoogleMapsCard';
// Fetch Locations for Map
/**
 * Fetches and updates the locations of restaurants using Google Maps API.
 * @returns {JSX.Element} The map component displaying the locations.
 */
/**
 * Fetches and displays locations on a map.
 *
 * @returns {JSX.Element} The LocationFetcher component.
 */
const LocationFetcher = (isLoaded) => {
  const [locations, setLocations] = useState([]);

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
            const location = await fetchCoordinates(restaurantAddress, restaurant);
            return {
              restaurantName,
              restaurantAddress,
              location,
              id: numericId,
            };
          } catch (error) {
            console.error(`Failed to fetch coordinates for ${restaurantName} with address: ${restaurantAddress}`, error);
            return null;
          }
        });

        const updatedLocations = (await Promise.all(locationPromises)).filter(Boolean);

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
