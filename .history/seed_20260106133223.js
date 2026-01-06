import dotenv from 'dotenv';
import fs from 'fs/promises';
import { createRestaurant } from './api/Restaurants.js';
import { createDish } from './api/Dish.js';
import { createFoodLog } from './api/FoodLog.js';

// Load environment variables
dotenv.config({ path: '.env.local' });
console.log('Database URL:', process.env.NEXT_PUBLIC_DATABASE_URL);

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Load data
    const restaurantsData = JSON.parse(await fs.readFile('./utils/data/restaurants.json', 'utf8'));
    const dishesData = JSON.parse(await fs.readFile('./utils/data/dishes.json', 'utf8'));
    const foodlogsData = JSON.parse(await fs.readFile('./utils/data/foodlogs.json', 'utf8'));

    // Seed restaurants
    console.log('Seeding restaurants...');
    for (const restaurant of restaurantsData) {
      const { id, uid_id, ...payload } = restaurant;
      payload.uid = uid_id; // Rename uid_id to uid
      await createRestaurant(payload);
      console.log(`Seeded restaurant: ${payload.restaurant_name}`);
    }

    // Seed dishes
    console.log('Seeding dishes...');
    for (const dish of dishesData) {
      const { id, ...payload } = dish;
      await createDish(payload);
      console.log(`Seeded dish: ${payload.dish_name}`);
    }

    // Seed food logs
    console.log('Seeding food logs...');
    for (const log of foodlogsData) {
      const { id, restaurant_id, dish_id, category_ids, ...payload } = log;
      payload.restaurant = restaurant_id;
      payload.dish = dish_id;
      payload.category = category_ids;
      await createFoodLog(payload);
      console.log(`Seeded food log for dish ID ${dish_id} at restaurant ID ${restaurant_id}`);
    }

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedData();