import { useEffect, useState } from 'react';
/**
 * Fetches the coordinates (latitude and longitude) for a given address using the Google Maps Geocoding API.
 * @param {string} address - The address to fetch coordinates for.
 * @param {string} restaurantId - The ID of the restaurant associated with the address.
 * @returns {Promise<{ lat: number, lng: number }>} A promise that resolves to an object containing the latitude and longitude.
 * @throws {Error} If no results are found for the given address and restaurant ID.
 */
const fetchCoordinates = (address, restaurantId) => {
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

function useGoogleMapsScript(apiKey) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
}

export { fetchCoordinates, useGoogleMapsScript };
