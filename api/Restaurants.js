const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

const getAllRestaurants = () =>
  new Promise((resolve, reject) => {
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

const getAllRestaurantsByUid = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/restaurants?uid=${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const createRestaurant = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/restaurants`, {
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

const updateRestaurant = (id, payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/restaurants/${id}`, {
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
    fetch(`${endpoint}/restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getAllRestaurants, getAllRestaurantsByUid, updateRestaurant, deleteRestaurant, createRestaurant };
