// // GoogleMapScript.js
// import { useState, useEffect } from 'react';

// export function useGoogleMapsScript(apiKey) {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     if (!apiKey) {
//       console.error('Google Maps API key is required');
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//     script.async = true;
//     script.onload = () => setLoaded(true);
//     script.onerror = () => console.error('Failed to load Google Maps script');

//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [apiKey]);

//   return loaded;
// }

// import { useState, useEffect } from 'react';

// const useGoogleMapsScript = (apiKey) => {
//   const [scriptLoaded, setScriptLoaded] = useState(false);

//   useEffect(() => {
//     const existingScript = document.getElementById('googleMaps');

//     if (!existingScript) {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//       script.id = 'googleMaps';
//       document.body.appendChild(script);

//       script.onload = () => {
//         setScriptLoaded(true);
//       };
//     } else {
//       setScriptLoaded(true);
//     }
//   }, [apiKey]);

//   return scriptLoaded;
// };

// export default useGoogleMapsScript;