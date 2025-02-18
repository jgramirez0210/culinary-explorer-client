// // utils/fetchCoordinates.js
// const fetchCoordinates = (address, restaurantId) => {
//   return new Promise((resolve, reject) => {
//     console.warn(`fetchCoordinates called with address: ${address}, restaurantId: ${restaurantId}`);
//     fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Network response was not ok: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.results && data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry.location;
//           const coordinates = { lat, lng };
//           console.warn(`Fetched coordinates for address: ${address}, restaurantId: ${restaurantId}`, coordinates);
//           resolve(coordinates);
//         } else {
//           console.error(`No results found for address: ${address}, restaurantId: ${restaurantId}`);
//           resolve({ lat: 0, lng: 0 }); // Provide default coordinates as fallback
//         }
//       })
//       .catch((error) => {
//         console.error(`Error fetching coordinates for address: ${address}, restaurantId: ${restaurantId}`, error);
//         resolve({ lat: 0, lng: 0 }); // Provide default coordinates as fallback
//       });
//   });
// };
const fetchCoordinates = (restaurant_address, restaurantId) => {
  console.warn(`Fetching coordinates for address: ${restaurant_address}, restaurantId: ${restaurantId}`);

  return new Promise((resolve) => {
    // Remove reject from Promise constructor
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(restaurant_address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          if (typeof lat === 'number' && typeof lng === 'number') {
            console.warn(`Coordinates found: lat=${lat}, lng=${lng}`);
            resolve({ lat, lng });
          } else {
            console.warn(`Invalid coordinates received`);
            resolve({ lat: 29.7604, lng: -95.3698 }); // Default to Houston coordinates
          }
        } else if (data.status === 'REQUEST_DENIED') {
          console.error('API key is restricted or invalid. Using default coordinates.');
          resolve({ lat: 29.7604, lng: -95.3698 }); // Default to Houston coordinates
        } else {
          console.warn(`No results found for address`);
          resolve({ lat: 29.7604, lng: -95.3698 }); // Default to Houston coordinates
        }
      })
      .catch((error) => {
        console.error(`Error fetching coordinates:`, error);
        resolve({ lat: 29.7604, lng: -95.3698 }); // Default to Houston coordinates
      });
  });
};

// // GoogleMapsScripts.js
// let scriptLoaded = false;
// let scriptLoadingPromise = null;

// const loadGoogleMapsScript = () => {
//   if (scriptLoaded) {
//     return Promise.resolve();
//   }

//   if (scriptLoadingPromise) {
//     return scriptLoadingPromise;
//   }

//   scriptLoadingPromise = new Promise((resolve, reject) => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
//     script.async = true;
//     script.onload = () => {
//       scriptLoaded = true;
//       resolve();
//     };
//     script.onerror = (error) => {
//       reject(error);
//     };
//     document.head.appendChild(script);
//   });

//   return scriptLoadingPromise;
// };
const loadGoogleMapsAPI = (callback, onError) => {
  if (typeof document !== 'undefined') {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.setAttribute('loading', 'async');
      script.onerror = onError;
      window.initMap = callback;
      document.head.appendChild(script);
    } else {
      // If script is already present, directly call the callback
      if (window.google && window.google.maps) {
        callback();
      } else {
        window.initMap = callback;
      }
    }
  }
};
export { loadGoogleMapsAPI, fetchCoordinates };
