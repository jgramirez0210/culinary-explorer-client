const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

const getFoodLog = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch(reject);
});
