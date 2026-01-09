const fetchCoordinates = (restaurant_address, restaurantId) => {
  console.log('GoogleMapsScripts: Fetching coordinates for address:', restaurant_address, 'ID:', restaurantId);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log('GoogleMapsScripts: Using API key (first 10 chars):', apiKey ? apiKey.substring(0, 10) : 'NO API KEY');

  return new Promise((resolve) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(restaurant_address)}&key=${apiKey}`;
    console.log('GoogleMapsScripts: Making API call to:', url.replace(apiKey, 'API_KEY_REDACTED'));

    fetch(url)
      .then((response) => {
        console.log('GoogleMapsScripts: API response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('GoogleMapsScripts: API response data:', data);
        if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
          const location = data.results[0].geometry.location;
          console.log('GoogleMapsScripts: Raw location from API:', location);
          if (typeof location.lat === 'number' && typeof location.lng === 'number' && !isNaN(location.lat) && !isNaN(location.lng)) {
            console.log('GoogleMapsScripts: Valid coordinates found:', location);
            resolve(location);
            return;
          } else {
            console.error('GoogleMapsScripts: Invalid coordinate types or NaN values:', location);
          }
        } else {
          console.error('GoogleMapsScripts: API status not OK or no results. Status:', data.status, 'Results count:', data.results?.length || 0);
        }
        throw new Error('Invalid coordinates');
      })
      .catch((error) => {
        console.error('GoogleMapsScripts: Error fetching coordinates:', error);
        resolve(null);
      });
  });
};

export { fetchCoordinates };
