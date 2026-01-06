const getAllDishes = () => new Promise((resolve, reject) => {
  const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
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


const createDish = async (payload) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;
    const response = await fetch(`${endpoint}/dish`, {
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

const getSingleDish = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/dish/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});
const updateDish = (id, payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/dish/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((data) => resolve(data))
    .catch(reject);
});
const deleteDish = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/dish/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});

export {getAllDishes, createDish, getSingleDish, updateDish, deleteDish};