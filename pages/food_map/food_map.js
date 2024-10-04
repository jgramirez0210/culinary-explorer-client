// import React, { useEffect } from 'react';

// const FoodMap = () => {
//   useEffect(() => {
//     const init = () => {
//       try {
//         const map = new google.maps.Map(document.getElementById('map'), {
//           center: { lat: -34.397, lng: 150.644 },
//           zoom: 8,
//         });

//         if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
//           const marker = new google.maps.marker.AdvancedMarkerElement({
//             position: { lat: -34.397, lng: 150.644 },
//             map: map,
//           });

//           const infowindow = new google.maps.InfoWindow({
//             content: `<span>${place.formattedAddress}</span>`,
//           });

//           marker.addListener('click', () => {
//             infowindow.open(map, marker);
//           });

//           console.log('Google Maps API initialized successfully.');
//         } else {
//           console.error('AdvancedMarkerElement is not available in the Google Maps API.');
//         }
//       } catch (error) {
//         console.error('Error initializing Google Maps API:', error);
//       }
//     };

//     if (typeof window !== 'undefined') {
//       if (!document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=marker`;
//         script.async = true;
//         script.defer = true;
//         document.head.appendChild(script);

//         script.onload = () => {
//           init();
//         };

//         script.onerror = () => {
//           console.error('Error loading Google Maps API script.');
//         };
//       } else {
//         init();
//       }
//     }
//   }, []);

//   return (
//     <div id="map" style={{ height: '100vh', width: '100%' }}>
//       <gmp-map style={{ height: '100%', width: '100%' }}>
//         <gmp-advanced-marker></gmp-advanced-marker>
//         <gmpx-place-picker></gmpx-place-picker>
//       </gmp-map>
//     </div>
//   );
// };

// export default FoodMap;

// import React from 'react';
// import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

// function App() {
//   const position = { lat: 53.54992, lng: 10.00678 };

//   return (
//     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//       <Map defaultCenter={position} defaultZoom={10} mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}>
//         <AdvancedMarker position={position} />
//       </Map>
//     </APIProvider>
//   );
// }

// import React, { useEffect, useState } from 'react';

// function App() {
//   //HOOKS TO DEFINE THE DEFAULT MAP LOAD POSITION
//   const defaultPosition = { lat: 29.749907, lng: -95.358421 };
//   const [position, setPosition] = useState(defaultPosition);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&map_ids=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}`;
//     script.async = true;
//     script.onload = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const userPosition = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             };
//             setPosition(userPosition);
//             initializeMap(userPosition);
//           },
//           () => {
//             initializeMap(defaultPosition);
//           }
//         );
//       } else {
//         initializeMap(defaultPosition);
//       }
//     };
//     script.onerror = () => {
//       console.error('Error loading Google Maps API script.');
//     };
//     document.head.appendChild(script);
//   }, []);

//   const initializeMap = (position) => {
//     const map = new google.maps.Map(document.getElementById('map'), {
//       center: position,
//       zoom: 11,
//       mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
//     });

//     new google.maps.Marker({
//       map,
//       position,
//     });

//     // Create the search box and link it to the UI element.
//     const input = document.getElementById('pac-input');
//     const searchBox = new google.maps.places.SearchBox(input);

//     // Bias the SearchBox results towards current map's viewport.
//     map.addListener('bounds_changed', () => {
//       searchBox.setBounds(map.getBounds());
//     });

//     let markers = [];

//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.
//     searchBox.addListener('places_changed', () => {
//       const places = searchBox.getPlaces();

//       if (places.length === 0) {
//         return;
//       }

//       // Clear out the old markers.
//       markers.forEach((marker) => {
//         marker.setMap(null);
//       });
//       markers = [];

//       // For each place, get the icon, name and location.
//       const bounds = new google.maps.LatLngBounds();
//       places.forEach((place) => {
//         if (!place.geometry || !place.geometry.location) {
//           console.log('Returned place contains no geometry');
//           return;
//         }

//         const icon = {
//           url: place.icon,
//           size: new google.maps.Size(71, 71),
//           origin: new google.maps.Point(0, 0),
//           anchor: new google.maps.Point(17, 34),
//           scaledSize: new google.maps.Size(25, 25),
//         };

//         // Create a marker for each place.
//         markers.push(
//           new google.maps.Marker({
//             map,
//             icon,
//             title: place.name,
//             position: place.geometry.location,
//           })
//         );

//         if (place.geometry.viewport) {
//           // Only geocodes have viewport.
//           bounds.union(place.geometry.viewport);
//         } else {
//           bounds.extend(place.geometry.location);
//         }
//       });
//       map.fitBounds(bounds);
//     });
//   };

//   return (
//     <div>
//       <input
//         id="pac-input"
//         className="controls"
//         type="text"
//         placeholder="Search Box"
//         style={{
//           boxSizing: 'border-box',
//           border: '1px solid transparent',
//           width: '240px',
//           height: '32px',
//           marginTop: '10px',
//           padding: '0 12px',
//           borderRadius: '3px',
//           boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
//           fontSize: '14px',
//           outline: 'none',
//           textOverflow: 'ellipses',
//           position: 'absolute',
//           top: '10px',
//           left: '50%',
//           marginLeft: '-120px',
//         }}
//       />
//       <div id="map" style={{ height: '100vh', width: '100%' }}></div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect, useRef } from 'react';

const FoodMap = () => {
  const houstonPosition = { lat: 29.749907, lng: -95.358421 };
  const [state, setState] = useState({ position: houstonPosition, isLoaded: false });
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&map_ids=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}`;
      script.async = true;
      script.onload = handleScriptLoad;
      script.onerror = () => console.error('Error loading Google Maps API script.');
      document.head.appendChild(script);
    };

    const handleScriptLoad = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setState({ position: userPosition, isLoaded: true });
            initializeMap(userPosition);
          },
          () => {
            setState((prevState) => ({ ...prevState, isLoaded: true }));
            initializeMap(houstonPosition);
          }
        );
      } else {
        setState((prevState) => ({ ...prevState, isLoaded: true }));
        initializeMap(houstonPosition);
      }
    };

    const initializeMap = (position) => {
      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 12,
      });
      new google.maps.Marker({
        position,
        map,
      });
    };

    loadGoogleMapsScript();
  }, []);

  if (!state.isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="food-map">
      <h1>Food Map</h1>
      <div ref={mapRef} style={{ width: '100%', height: '800px' }}></div>
    </div>
  );
};

export default FoodMap;