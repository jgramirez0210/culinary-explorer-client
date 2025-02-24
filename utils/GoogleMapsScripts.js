// Track the loading state and callbacks
let isLoading = false;
let callbacks = [];
let scriptPromise = null;

const loadGoogleMapsAPI = (callback, onError) => {
  if (typeof window === 'undefined') return;

  // If the API is already loaded, call the callback immediately
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  // Add to callbacks if already loading
  if (isLoading) {
    callbacks.push(callback);
    return;
  }

  // Create a promise to load the script if not already created
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      isLoading = true;
      callbacks.push(callback);

      // Define the callback that Google Maps will call
      window.initMap = () => {
        isLoading = false;
        callbacks.forEach((cb) => cb());
        callbacks = [];
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=places,marker&callback=initMap`;
      script.async = true;
      script.defer = true;

      script.onerror = (error) => {
        isLoading = false;
        callbacks.forEach((cb) => {
          if (onError) onError(error);
        });
        callbacks = [];
        reject(error);
      };

      document.head.appendChild(script);
    });
  } else {
    // If we already have a promise but it hasn't resolved yet
    callbacks.push(callback);
  }

  return () => {
    callbacks = callbacks.filter((cb) => cb !== callback);
  };
};

const fetchCoordinates = async (address) => {
  try {
    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export { loadGoogleMapsAPI, fetchCoordinates };
