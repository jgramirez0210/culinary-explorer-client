import React, { useState, useEffect, useCallback } from 'react';
import { loadGoogleMapsAPI } from '../utils/GoogleMapsScripts';

const HOUSTON_CENTER = {
  lat: 29.7589382,
  lng: -95.3676974,
};

const GoogleMapsCard = ({ currentUser }) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(HOUSTON_CENTER);
  const [locations, setLocations] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  const getCurrentLocation = useCallback(async () => {
    const useHoustonLocation = () => {
      setUserLocation(HOUSTON_CENTER);
      setLocationError('Using default Houston location.');
      if (map) {
        map.panTo(HOUSTON_CENTER);
        map.setZoom(11);
      }
    };

    if (!navigator.geolocation) {
      useHoustonLocation();
      return;
    }

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

      if (map) {
        map.panTo(userPos);
        map.setZoom(13);
      }
    } catch (error) {
      console.warn('Browser geolocation failed:', error);
      useHoustonLocation();
    } finally {
      setIsGettingLocation(false);
    }
  }, [map]);

  // Initialize map
  useEffect(() => {
    let mounted = true;
    let cleanupCallback = null;

    const initMap = () => {
      if (!mounted) return;

      try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          console.error('Map element not found');
          return;
        }

        console.log('Map ID:', process.env.NEXT_PUBLIC_GOOGLE_MAP_ID);

        const newMap = new google.maps.Map(mapElement, {
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

        if (!mounted) {
          newMap.setMap(null);
          return;
        }

        // Create user location marker
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

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: userLocation,
          map: newMap,
          title: 'Your Location',
          content: userLocationGlyph,
        });

        setMap(newMap);
        setIsLoaded(true);

        // Get user location after map is initialized
        getCurrentLocation();
      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setErrorMessage('Error initializing map.');
          setLoadError(true);
        }
      }
    };

    // Load Google Maps API
    cleanupCallback = loadGoogleMapsAPI(initMap, (error) => {
      if (mounted) {
        setLoadError(true);
        setErrorMessage('Error loading Google Maps API. Please check API key configuration.');
        console.error('Google Maps API Error:', error);
      }
    });

    return () => {
      mounted = false;
      if (map) {
        map.setMap(null);
        setMap(null);
      }
      if (cleanupCallback) {
        cleanupCallback();
      }
    };
  }, []); // Empty dependency array since we handle userLocation updates separately

  // Handle restaurant markers
  useEffect(() => {
    if (!isLoaded || !map || !locations) return;

    // Clean up existing markers
    if (window.currentMarkers) {
      window.currentMarkers.forEach((marker) => {
        if (marker) {
          marker.map = null;
        }
      });
    }
    window.currentMarkers = [];

    locations.forEach((location) => {
      if (!location || !location.coordinates) return;

      const coords = {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      };

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="margin: 0 0 5px;">${location.restaurant_name || 'Restaurant'}</h3>
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

      const marker = new google.maps.marker.AdvancedMarkerElement({
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
    });

    // Add click listener to close info windows when clicking on the map
    google.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
      }
    });
  }, [isLoaded, map, locations, activeInfoWindow]);

  return (
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
  );
};

export default GoogleMapsCard;
