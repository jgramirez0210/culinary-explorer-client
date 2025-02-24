const fetchCoordinates = (restaurant_address, restaurantId) => {
  console.warn(`Fetching coordinates for address: ${restaurant_address}, restaurantId: ${restaurantId}`);

  return new Promise((resolve) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(restaurant_address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
          const location = data.results[0].geometry.location;
          if (typeof location.lat === 'number' && typeof location.lng === 'number' && !isNaN(location.lat) && !isNaN(location.lng)) {
            resolve(location);
            return;
          }
        }
        throw new Error('Invalid coordinates');
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
        resolve(null);
      });
  });
};

const loadGoogleMapsAPI = (callback, onError) => {
  if (typeof document !== 'undefined') {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.loading = 'async';
      script.onerror = onError;

      // Create a promise to handle the script load
      const loadPromise = new Promise((resolve) => {
        script.addEventListener('load', () => {
          resolve();
          if (callback) callback();
        });
      });

      document.head.appendChild(script);
      return loadPromise;
    } else {
      // If script is already present, return a resolved promise
      if (window.google && window.google.maps) {
        if (callback) callback();
        return Promise.resolve();
      } else {
        // Wait for the existing script to load
        return new Promise((resolve) => {
          window.initMap = () => {
            resolve();
            if (callback) callback();
          };
        });
      }
    }
  }
  return Promise.resolve();
};

export { loadGoogleMapsAPI, fetchCoordinates };
