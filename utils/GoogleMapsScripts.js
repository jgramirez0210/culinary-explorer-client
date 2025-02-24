const fetchCoordinates = async (address, options = {}) => {
  try {
    console.warn('Converting address to coordinates:', address);

    const encodedAddress = encodeURIComponent(address);
    const queryParams = new URLSearchParams({
      address: encodedAddress,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      console.warn('Geocoding result:', {
        originalAddress: address,
        formattedAddress: data.results[0].formatted_address,
        coordinates: { lat, lng },
        placeId: data.results[0].place_id,
      });
      return { lat, lng };
    }

    console.warn('Geocoding failed for address:', address, 'Status:', data.status);
    return null; // Return null instead of throwing an error
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

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
