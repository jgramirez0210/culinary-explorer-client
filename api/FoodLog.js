const getAllFoodLogs = () =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    console.log('getAllFoodLogs: Fetching from endpoint:', endpoint + '/food_log');
    fetch(`${endpoint}/food_log`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('getAllFoodLogs: Response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('getAllFoodLogs: Raw data received:', data);
        resolve(data);
      })
      .catch((error) => {
        console.error('getAllFoodLogs: Fetch error:', error);
        reject(error);
      });
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
    console.log('getFoodLogByUser called with uid:', uid);
    getAllFoodLogs()
      .then((allLogs) => {
        // Filter logs by user ID on the client side
        const filteredLogs = allLogs.filter((log) => log.uid === uid);
        console.log('Filtered logs for uid', uid, ':', filteredLogs);
        resolve(filteredLogs);
      })
      .catch((error) => {
        console.error('Error getting food logs by user ID:', error);
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
    console.log('deleteItem: Fetching from endpoint:', `${endpoint}/food_log/${id}`);
    fetch(`${endpoint}/food_log/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('deleteItem: Response status:', response.status);
        if (!response.ok) {
          console.error('deleteItem: Response not ok:', response.statusText);
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        // For DELETE, often no body, so resolve with status or empty
        console.log('deleteItem: DELETE successful, resolving with response');
        resolve(response);
      })
      .catch((error) => {
        console.error('deleteItem: Fetch error:', error);
        reject(error);
      });
  });

const updateFoodLog = (id, payload) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    console.log('updateFoodLog: Fetching from endpoint:', `${endpoint}/food_log/${id}`, 'with payload:', payload);
    fetch(`${endpoint}/food_log/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        console.log('updateFoodLog: Response status:', response.status);
        if (!response.ok) {
          console.error('updateFoodLog: Response not ok:', response.statusText);
          reject(new Error(`HTTP error! status: ${response.status}`));
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log('updateFoodLog: Parsed data:', data);
        resolve(data);
      })
      .catch((error) => {
        console.error('updateFoodLog: Fetch error:', error);
        reject(error);
      });
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
