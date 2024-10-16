const fetchCoordinates = (address) => {
  return new Promise((resolve, reject) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          resolve({ lat, lng });
        } else {
          reject(new Error(`No results found for address: ${address}`));
        }
      })
      .catch((error) => {
        console.error(`Error fetching coordinates for address: ${address}`, error);
        reject(error);
      });
  });
};

export default fetchCoordinates;
