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

const getFoodLogByRestaurantId = (restaurantId) => new Promise((resolve, reject) => {

  
  fetch(`${endpoint}/food_log/by_restaurant?restaurant_id=${restaurantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      try {
        const data = JSON.parse(text);
        resolve(data);
      } catch (error) {
        throw new Error('Invalid JSON: ' + text);
      }
    })
    .catch(reject);
});
const getFoodLogByUser = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log/?uid=${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    });
});

const getSingleFoodLog = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const createFoodLog = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteItem = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});

const updateFoodLog = (id, payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/food_log/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((data) => resolve(data))
    .catch(reject);
});

const searchItems = (searchValue) => new Promise((resolve, reject) => {
  getAllFoodLogs()
    .then((items) => {
      const filteredItems = items.filter((item) => 
        item.dish.dish_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.restaurant.restaurant_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.category.some(cat => cat.category.toLowerCase().includes(searchValue.toLowerCase()))
      );
      resolve(filteredItems);
    })
    .catch(reject);
});


export {
  getAllFoodLogs,
  getSingleFoodLog,
  createFoodLog,
  deleteItem,
  updateFoodLog,
  getFoodLogByUser,
  getFoodLogByRestaurantId,
  searchItems
};