import React, { useState, useEffect } from 'react';
import { loadGoogleMapsAPI } from '../utils/GoogleMapsScripts';
import LocationFetcher from '../utils/googleMapsMarkers';

const HOUSTON_CENTER = {
  lat: 29.7589382,
  lng: -95.3676974,
};

const GoogleMapsCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState(HOUSTON_CENTER);
  const [map, setMap] = useState(null);

  // First useEffect: Get user location and load Google Maps API
  useEffect(() => {
    // Request user location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.warn('Error getting user location:', error);
          // Keep default Houston coordinates if geolocation fails
        },
      );
    }

    // Then load Google Maps API
    try {
      loadGoogleMapsAPI(
        () => setIsLoaded(true),
        (error) => {
          setLoadError(true);
          setErrorMessage('Error loading Google Maps API. Please check API key configuration.');
          console.error('Google Maps API Error:', error);
        },
      );
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setLoadError(true);
      setErrorMessage('Failed to initialize map.');
    }
  }, []);

  // Second useEffect: Initialize map once API is loaded and we have user location
  useEffect(() => {
    if (isLoaded) {
      try {
        const newMap = new google.maps.Map(document.getElementById('map'), {
          center: userLocation,
          zoom: 5, // Set a reasonable initial zoom level
          minZoom: 5, // Prevent zooming out too far
          maxZoom: 18, // Prevent zooming in too close
          gestureHandling: 'cooperative',
          fullscreenControl: true,
          mapTypeControl: true,
          zoomControl: true,
        });
        setMap(newMap);

        // Create bounds with padding around user location
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(userLocation.lat - 0.1, userLocation.lng - 0.1));
        bounds.extend(new google.maps.LatLng(userLocation.lat + 0.1, userLocation.lng + 0.1));
        newMap.fitBounds(bounds);

        // Force a slightly wider view after bounds are set
        google.maps.event.addListenerOnce(newMap, 'bounds_changed', () => {
          newMap.setZoom(11);
        });

        // Add marker for user's location
        new google.maps.Marker({
          position: userLocation,
          map: newMap,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setErrorMessage('Error initializing map.');
      }
    }
  }, [isLoaded, userLocation]);

  // Handle locations updates
  useEffect(() => {
    if (map && locations?.length > 0) {
      console.log('Attempting to add markers for locations:', locations);
      const bounds = new google.maps.LatLngBounds();

      // Add user location to bounds
      console.log('Adding user location to bounds:', userLocation);
      bounds.extend(userLocation);

      // Clear existing markers (if needed)
      locations.forEach((location) => {
        // Check for nested coordinates structure
        const coords = location.coordinates || location;
        if (coords?.lat && coords?.lng) {
          console.log('Creating marker for location:', location.restaurant_name);
          const marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: location.name || 'Restaurant', // Add title if available
            animation: google.maps.Animation.DROP, // Add animation
          });
          bounds.extend(marker.getPosition());
        } else {
          console.warn('Invalid location data:', location);
        }
      });

      // Adjust bounds with some padding
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      bounds.extend(new google.maps.LatLng(ne.lat() + 0.01, ne.lng() + 0.01));
      bounds.extend(new google.maps.LatLng(sw.lat() - 0.01, sw.lng() - 0.01));

      console.log('Fitting bounds to show all markers');
      map.fitBounds(bounds);

      // Set minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', function () {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    } else {
      console.warn('Map or locations not ready:', { map: !!map, locationsLength: locations?.length });
    }
  }, [map, locations, userLocation]);

  if (loadError) {
    return <div className="error-message">{errorMessage || 'Error loading map'}</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <LocationFetcher isLoaded={isLoaded} onLocationsFetched={setLocations} />
      <div id="map" style={{ height: '100vh', width: '100vw', position: 'absolute' }}></div>
    </div>
  );
};

export default GoogleMapsCard;
