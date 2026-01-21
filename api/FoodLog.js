const getAllFoodLogs = () =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/food_log`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const getFoodLogByRestaurantId = (restaurantId, uid) =>
  new Promise((resolve, reject) => {
    getAllFoodLogs()
      .then((allLogs) => {
        // Filter logs by UID first, then by restaurant ID on the client side
        let filteredLogs = allLogs.filter((log) => log.uid === uid);
        filteredLogs = filteredLogs.filter((log) => log.restaurant && log.restaurant.id === Number(restaurantId));
        resolve(filteredLogs);
      })
      .catch((error) => {
        reject(error);
      });
  });

const getFoodLogByUser = (uid) =>
  new Promise((resolve, reject) => {
    getAllFoodLogs()
      .then((allLogs) => {
        // Filter logs by user ID on the client side
        const filteredLogs = allLogs.filter((log) => log.uid === uid);
        resolve(filteredLogs);
      })
      .catch((error) => {
        reject(error);
      });
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
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
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
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        return response.json();
      })
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
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        // For DELETE, often no body, so resolve with status or empty
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

const updateFoodLog = (id, payload) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/food_log/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

const searchItems = (searchValue, uid) =>
  new Promise((resolve, reject) => {
    getFoodLogByUser(uid)
      .then((items) => {
        const filteredItems = items.filter((item) => item.dish?.dish_name?.toLowerCase().includes(searchValue.toLowerCase()) || item.restaurant?.restaurant_name?.toLowerCase().includes(searchValue.toLowerCase()) || item.category?.some((cat) => cat.category?.toLowerCase().includes(searchValue.toLowerCase())));
        resolve(filteredItems);
      })
      .catch(reject);
  });

export { getAllFoodLogs, getSingleFoodLog, createFoodLog, deleteItem, updateFoodLog, getFoodLogByUser, getFoodLogByRestaurantId, searchItems };
