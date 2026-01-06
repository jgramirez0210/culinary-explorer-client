const getAllFoodLogs = () =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/food_log`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getFoodLogByRestaurantId = (restaurantId) =>
  new Promise((resolve, reject) => {
    getAllFoodLogs()
      .then((allLogs) => {
        // Filter logs by restaurant ID on the client side
        const filteredLogs = allLogs.filter((log) => log.restaurant && log.restaurant.id === Number(restaurantId));
        resolve(filteredLogs);
      })
      .catch((error) => {
        console.error('Error getting food logs by restaurant ID:', error);
        reject(error);
      });
  });

const getFoodLogByUser = (uid) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/food_log?uid=${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSingleFoodLog = (id) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
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

const createFoodLog = (payload) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
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

const deleteItem = (id) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/food_log/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => resolve(data))
      .catch(reject);
  });

const updateFoodLog = (id, payload) =>
  new Promise((resolve, reject) => {
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

const searchItems = (searchValue) =>
  new Promise((resolve, reject) => {
    getAllFoodLogs()
      .then((items) => {
        const filteredItems = items.filter((item) => item.dish.dish_name.toLowerCase().includes(searchValue.toLowerCase()) || item.restaurant.restaurant_name.toLowerCase().includes(searchValue.toLowerCase()) || item.category.some((cat) => cat.category.toLowerCase().includes(searchValue.toLowerCase())));
        resolve(filteredItems);
      })
      .catch(reject);
  });

export { getAllFoodLogs, getSingleFoodLog, createFoodLog, deleteItem, updateFoodLog, getFoodLogByUser, getFoodLogByRestaurantId, searchItems };
