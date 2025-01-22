// utils/fetchCoordinates.js
const fetchCoordinates = (address) => {};

// const fetchCoordinates = (address, restaurantId) => {
//   return new Promise((resolve, reject) => {
//     fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.results && data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry.location;
//           const coordinates = { lat, lng };
//           console.warn(`Fetched coordinates for address: ${address}, restaurantId: ${restaurantId}`, coordinates);
//           resolve(coordinates);
//         } else {
//           reject(new Error(`No results found for address: ${address}, restaurantId: ${restaurantId}`));
//         }
//       })
//       .catch((error) => {
//         console.error(`Error fetching coordinates for address: ${address}, restaurantId: ${restaurantId}`, error);
//         reject(error);
//       });
//   });
// };

// utils/loadGoogleMapsScript.js
// const loadGoogleMapsScript = (options) => {
//   const existingScript = document.getElementById('google-maps-script');
//   if (existingScript) {
//     return Promise.resolve();
//   }

//   const script = document.createElement('script');
//   script.id = 'google-maps-script';
//   script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=${options.libraries.join(',')}&language=${options.language}&region=${options.region}&callback=initMap`;
//   script.async = true;
//   script.defer = true;
//   document.head.appendChild(script);

//   return new Promise((resolve) => {
//     window.initMap = () => {
//       resolve();
//     };
//   });
// };

// utils/GoogleMapsScripts.js

export const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`;
    script.id = 'googleMaps';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  } else if (callback) {
    callback();
  }
};
