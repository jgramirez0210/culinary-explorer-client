const getAllRestaurants = () =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/culinary_explorer_api_restaurants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });

const getAllRestaurantsByUid = (uid) =>
  new Promise((resolve, reject) => {
    getAllRestaurants()
      .then((allRestaurants) => {
        // Filter restaurants by user ID on the client side
        const filteredRestaurants = allRestaurants.filter((restaurant) => restaurant.uid === uid);
        resolve(filteredRestaurants);
      })
      .catch((error) => {
        reject(error);
      });
  });

const createRestaurant = (payload) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/culinary_explorer_api_restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`HTTP ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

const updateRestaurant = (id, payload) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/culinary_explorer_api_restaurants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((data) => resolve(data))
      .catch(reject);
  });

const deleteRestaurant = (id) =>
  new Promise((resolve, reject) => {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    fetch(`${endpoint}/culinary_explorer_api_restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getAllRestaurants, getAllRestaurantsByUid, updateRestaurant, deleteRestaurant, createRestaurant };
