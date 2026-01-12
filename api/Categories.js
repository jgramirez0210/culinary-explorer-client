const endpoint = process.env.NEXT_PUBLIC_DATABASE_URL;

/**
 * Retrieves all categories from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of categories.
 */
const getAllCategories = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getAllCategories };
