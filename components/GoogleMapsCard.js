import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { getAllRestaurants } from '../api/Restaurants';
import fetchCoordinates from '../api/GoogleMapsApi';
import DishListByRestaurant from './DishListByRestaurant';

const center = { lat: 29.749907, lng: -95.358421 };

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

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
            const location = await fetchCoordinates(restaurantAddress);
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
        console.log('Updated Locations:', updatedLocations); // Debugging log
        setLocations(updatedLocations);
      } catch (error) {
        console.error('Error updating locations:', error);
      }
    };

    updateLocations();
  }, []);

  const handleMarkerMouseOver = (poi) => {
    setActiveMarker(poi); // Open only one InfoWindow by setting the active marker
  };

  const handleInfoWindowCloseClick = () => {
    setActiveMarker(null); // Close the InfoWindow on clicking the 'x'
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
      {locations.map((poi) => {
        const restaurantId = poi.id;
        const isRestaurantIdValid = !Number.isNaN(Number(restaurantId));
        console.log('Marker Position:', poi.location); // Debugging log

        return (
          <Marker key={restaurantId} position={poi.location} title={poi.restaurantName} onMouseOver={() => handleMarkerMouseOver(poi)}>
            {activeMarker === poi && (
              <InfoWindow position={poi.location} onCloseClick={handleInfoWindowCloseClick}>
                <div>
                  <h3>{poi.restaurantName}</h3>
                  <p>{poi.restaurantAddress}</p>
                  {isRestaurantIdValid ? <DishListByRestaurant restaurantId={restaurantId} /> : <p>Error: Invalid restaurant ID</p>}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
};

export default MapComponent;
