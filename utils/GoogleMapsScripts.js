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

const fetchCoordinates = (address, restaurantId) => {
  // Implementation for fetching coordinates based on address
  return new Promise((resolve, reject) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          resolve({ lat, lng });
        } else {
          reject(new Error(`No results found for address: ${address}, restaurantId: ${restaurantId}`));
        }
      })
      .catch((error) => {
        console.error(`Error fetching coordinates for address: ${address}, restaurantId: ${restaurantId}`, error);
        reject(error);
      });
  });
};

export default fetchCoordinates;

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
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = onError;
    window.initMap = callback;
    document.head.appendChild(script);
  }
};

export { loadGoogleMapsAPI, fetchCoordinates };
