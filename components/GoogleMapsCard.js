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
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markersInitialized, setMarkersInitialized] = useState(false);

  // First useEffect remains the same
  useEffect(() => {
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
        },
      );
    }

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

  // Initialize map
  useEffect(() => {
    if (isLoaded) {
      try {
        const newMap = new google.maps.Map(document.getElementById('map'), {
          center: userLocation,
          zoom: 11,
          minZoom: 5,
          maxZoom: 18,
          gestureHandling: 'cooperative',
          fullscreenControl: true,
          mapTypeControl: true,
          zoomControl: true,
        });
        setMap(newMap);

        // Add user location marker
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

  // Handle locations updates with hover functionality
  useEffect(() => {
    if (map && locations?.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(userLocation);

      // Add click listener to map to close active info window
      map.addListener('click', () => {
        if (activeInfoWindow) {
          activeInfoWindow.close();
          setActiveInfoWindow(null);
        }
      });

      locations.forEach((location) => {
        const coords = location.coordinates || location;
        if (coords?.lat && coords?.lng) {
          // Create info window content
          const infoContent = `
            <div style="padding: 12px; max-width: 300px;">
              <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 16px;">
                ${location.restaurant_name || 'Restaurant'}
              </h3>
              ${
                location.restaurant_address
                  ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                  ${location.restaurant_address}
                </p>`
                  : ''
              }
              ${
                location.website_url
                  ? `<a href="${location.website_url}" 
                   target="_blank" 
                   style="color: #4285F4; text-decoration: none; font-size: 14px;">
                  Visit Website
                </a>`
                  : ''
              }
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
            maxWidth: 300,
          });

          // Add close listener to the info window
          infoWindow.addListener('closeclick', () => {
            setActiveInfoWindow(null);
          });

          const marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: location.restaurant_name || 'Restaurant',
            // Only animate markers on initial load
            animation: !markersInitialized ? google.maps.Animation.DROP : null,
          });

          // Add click listener to marker
          marker.addListener('click', (e) => {
            e.stop();
            if (activeInfoWindow) {
              activeInfoWindow.close();
            }
            infoWindow.open(map, marker);
            setActiveInfoWindow(infoWindow);
          });

          bounds.extend(marker.getPosition());
        }
      });

      // Set markers as initialized after first render
      if (!markersInitialized) {
        setMarkersInitialized(true);
      }

      // Add padding to bounds
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      bounds.extend(new google.maps.LatLng(ne.lat() + 0.01, ne.lng() + 0.01));
      bounds.extend(new google.maps.LatLng(sw.lat() - 0.01, sw.lng() - 0.01));

      map.fitBounds(bounds);

      // Set maximum zoom level
      const listener = google.maps.event.addListener(map, 'idle', function () {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, locations, userLocation, activeInfoWindow, markersInitialized]);

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
