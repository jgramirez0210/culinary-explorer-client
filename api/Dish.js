const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

const getAllDishes = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/dish`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {getAllDishes};