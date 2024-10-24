import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { getAllRestaurants } from '../api/Restaurants';
import fetchCoordinates from '../api/GoogleMapsApi';
import DishListByRestaurant from './DishListByRestaurant';

const center = {
  lat: 29.749907,
  lng: -95.358421,
};

const getRestaurantId = (poi) => {
  try {
    if (!poi?.id) {
      console.error('POI object or id property is missing:', poi);
      return null;
    }
    const id = Number(poi.id);
    if (Number.isNaN(id)) {
      console.error('POI ID is not a valid number:', poi.id);
      return null;
    }
    return id;
  } catch (error) {
    console.error('Error fetching restaurant ID:', error);
    return null;
  }
};

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
        setLocations(updatedLocations);
      } catch (error) {
        console.error('Error updating locations:', error);
      }
    };

    updateLocations();
  }, []);

  const handleMarkerClick = (poi) => {
    setActiveMarker(poi); // Set the active marker to the clicked marker
  };

  const handleInfoWindowCloseClick = () => {
    setActiveMarker(null); // Close the InfoWindow on clicking the 'x'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ height: '400px', width: '800px' }} center={center} zoom={10}>
        {locations.map((poi) => {
          const restaurantId = getRestaurantId(poi);

          return (
            <Marker
              key={restaurantId}
              position={poi.location}
              title={poi.restaurantName}
              onClick={() => handleMarkerClick(poi)}
            >
              {activeMarker?.id === poi.id && (
                <InfoWindow position={poi.location} onCloseClick={handleInfoWindowCloseClick}>
                  <div>
                    <h3>{poi.restaurantName}</h3>
                    <p>{poi.restaurantAddress}</p>
                    <DishListByRestaurant restaurantId={restaurantId} />
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
