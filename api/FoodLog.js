const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

const getAllFoodLogs = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data)) // Directly resolve the array of food logs
    .catch(reject);
});

const getSingleFoodLog = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data)) // Directly resolve the single food log object
    .catch(reject);
});

export {
  getAllFoodLogs,
  getSingleFoodLog,
};