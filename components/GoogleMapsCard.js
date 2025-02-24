import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMapsLoader } from '../utils/GoogleMapsLoader';
import { fetchCoordinates } from '../utils/GoogleMapsScripts';

const HOUSTON_CENTER = {
  lat: 29.7589382,
  lng: -95.3676974,
};

const GoogleMapsCard = ({ currentUser, restaurants }) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(HOUSTON_CENTER);
  const [locations, setLocations] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [userMarker, setUserMarker] = useState(null);

  const createUserMarker = useCallback(async (position, currentMap) => {
    if (!window.google?.maps) return null;

    const userLocationGlyph = document.createElement('div');
    userLocationGlyph.innerHTML = `
      <div style="
        background-color: #4285F4;
        border: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        transform: scale(1.2);
      "></div>
    `;

    try {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
      return new AdvancedMarkerElement({
        position,
        map: currentMap,
        title: 'Your Location',
        content: userLocationGlyph,
      });
    } catch (error) {
      console.error('Error creating marker:', error);
      return null;
    }
  }, []);

  const initMap = useCallback(async () => {
    try {
      const mapElement = document.getElementById('map');
      if (!mapElement || !window.google?.maps) {
        return;
      }

      const newMap = new window.google.maps.Map(mapElement, {
        center: userLocation,
        zoom: 11,
        minZoom: 5,
        maxZoom: 18,
        gestureHandling: 'cooperative',
        fullscreenControl: true,
        mapTypeControl: true,
        zoomControl: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });

      // Create initial user location marker
      const marker = await createUserMarker(userLocation, newMap);
      setUserMarker(marker);
      setMap(newMap);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError(true);
      setErrorMessage('Failed to load Google Maps');
    }
  }, [userLocation, createUserMarker]);

  const getCurrentLocation = useCallback(async () => {
    if (!map || !window.google?.maps) return;

    const useHoustonLocation = () => {
      setUserLocation(HOUSTON_CENTER);
      setLocationError('Using default Houston location.');
      if (map) {
        map.panTo(HOUSTON_CENTER);
        map.setZoom(11);
      }
    };

    setIsGettingLocation(true);
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserLocation(userPos);
      setLocationError('');

      // Update map position
      map.panTo(userPos);
      map.setZoom(13);

      // Update marker position
      if (userMarker) {
        userMarker.position = userPos;
      } else {
        const newMarker = await createUserMarker(userPos, map);
        setUserMarker(newMarker);
      }
    } catch (error) {
      console.warn('Browser geolocation failed:', error);
      useHoustonLocation();
    } finally {
      setIsGettingLocation(false);
    }
  }, [map, userMarker, createUserMarker]);

  // Initialize map when Google Maps script is loaded
  useEffect(() => {
    if (window.google?.maps && !map) {
      initMap();
    }
  }, [initMap, map]);

  // Handle script load
  const handleScriptLoad = useCallback(() => {
    console.log('Google Maps script loaded');
    if (!map) {
      initMap();
    }
  }, [initMap, map]);

  // Handle restaurant data
  useEffect(() => {
    if (!restaurants || !Array.isArray(restaurants)) {
      console.log('No restaurants data available or invalid format:', restaurants);
      setLocations([]);
      return;
    }

    const processRestaurants = async () => {
      const formattedLocations = await Promise.all(
        restaurants.map(async (restaurant) => {
          // If we already have coordinates, use them
          if (restaurant.latitude != null && restaurant.longitude != null) {
            return {
              restaurant_name: restaurant.restaurant?.restaurant_name,
              restaurant_address: restaurant.restaurant?.restaurant_address,
              rating: restaurant.rating,
              coords: {
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              },
            };
          }

          // If we have coords object, use it
          if (restaurant.coords?.lat != null && restaurant.coords?.lng != null) {
            return {
              restaurant_name: restaurant.restaurant?.restaurant_name,
              restaurant_address: restaurant.restaurant?.restaurant_address,
              rating: restaurant.rating,
              coords: restaurant.coords,
            };
          }

          // Try to fetch coordinates using the existing function
          const coords = await fetchCoordinates(restaurant.restaurant?.restaurant_address, restaurant.restaurant?.id);

          if (!coords) {
            console.warn('Skipping restaurant due to missing coordinates:', restaurant.restaurant?.restaurant_name);
            return null;
          }

          return {
            restaurant_name: restaurant.restaurant?.restaurant_name,
            restaurant_address: restaurant.restaurant?.restaurant_address,
            rating: restaurant.rating,
            coords,
          };
        }),
      );

      // Filter out null values and set locations
      const validLocations = formattedLocations.filter(Boolean);
      console.warn('Setting locations with valid coordinates:', validLocations);
      setLocations(validLocations);
    };

    processRestaurants();
  }, [restaurants]);

  // Handle restaurant markers
  useEffect(() => {
    const createMarkers = async () => {
      if (!map || !locations.length) {
        console.log('No map or locations available:', { map, locationsLength: locations.length });
        return;
      }

      // Clear existing markers
      if (window.currentMarkers) {
        window.currentMarkers.forEach((marker) => {
          marker.map = null;
        });
      }
      window.currentMarkers = [];

      console.log('Creating markers for locations:', locations);

      for (const location of locations) {
        if (!location.coords?.lat || !location.coords?.lng) {
          console.log('Invalid coordinates for location:', location);
          continue;
        }

        const coords = {
          lat: parseFloat(location.coords.lat),
          lng: parseFloat(location.coords.lng),
        };

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 10px;">${location.restaurant_name || 'Restaurant'}</h3>
              <p style="margin: 0 0 5px;">${location.restaurant_address || 'Address not available'}</p>
              ${location.rating ? `<p style="margin: 0;">Rating: ${location.rating}/5</p>` : ''}
            </div>
          `,
        });

        const restaurantPin = document.createElement('div');
        restaurantPin.innerHTML = `
          <div style="
            background-color: #FF5252;
            width: 24px;
            height: 24px;
            border-radius: 8px 8px 0 8px;
            transform: rotate(45deg);
            transform-origin: 0 100%;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
              position: absolute;
              top: 8px;
              left: 8px;
            "></div>
          </div>
        `;

        try {
          const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
          const marker = new AdvancedMarkerElement({
            position: coords,
            map: map,
            title: location.restaurant_name || 'Restaurant',
            content: restaurantPin,
          });

          window.currentMarkers.push(marker);

          marker.addListener('click', () => {
            if (activeInfoWindow) {
              activeInfoWindow.close();
            }
            infoWindow.open(map, marker);
            setActiveInfoWindow(infoWindow);
          });
        } catch (error) {
          console.error('Error creating marker:', error);
        }
      }
    };

    createMarkers();
  }, [map, locations, activeInfoWindow]);

  return (
    <>
      <GoogleMapsLoader
        onLoad={handleScriptLoad}
        onError={(e) => {
          console.error('Error loading Google Maps script:', e);
          setLoadError(true);
          setErrorMessage('Failed to load Google Maps');
        }}
      />
      <div className="map-container" style={{ width: '100%', height: '400px', position: 'relative' }}>
        {locationError && (
          <div
            className="alert alert-warning"
            role="alert"
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              backgroundColor: 'rgba(255, 243, 205, 0.9)',
              padding: '10px 20px',
              borderRadius: '4px',
              maxWidth: '80%',
              textAlign: 'center',
            }}
          >
            {locationError}
          </div>
        )}
        {loadError ? (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        ) : (
          <div id="map" style={{ width: '100%', height: '100%' }}>
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1,
                padding: '8px 16px',
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isGettingLocation ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isGettingLocation ? 'Getting Location...' : 'Get My Location'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GoogleMapsCard;
