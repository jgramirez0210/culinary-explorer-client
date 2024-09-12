const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

const getAllRestaurants = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/restaurants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {getAllRestaurants};