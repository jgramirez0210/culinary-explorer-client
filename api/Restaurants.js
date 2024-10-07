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

const createRestaurant = async (payload) => {
  try {
    const response = await fetch(`${endpoint}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server responded with an error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in createDish:', error);
    throw error;
  }
};

const updateRestaurant = (id, payload) => new Promise((resolve, reject) => {
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

const deleteRestaurant = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/restaurants/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});


export {getAllRestaurants, updateRestaurant, deleteRestaurant, createRestaurant};