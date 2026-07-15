const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
  try {
    if (req.query.key !== process.env.SEED_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@qalanjo.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    await User.deleteMany();
    await Category.deleteMany();
    await Food.deleteMany();

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '+256700000000',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+256711111111',
    });

    const categories = await Category.insertMany([
      { name: 'Appetizers', description: 'Start your meal right', sortOrder: 1 },
      { name: 'Main Course', description: 'Hearty and satisfying', sortOrder: 2 },
      { name: 'Pizza', description: 'Wood-fired perfection', sortOrder: 3 },
      { name: 'Burgers', description: 'Juicy and flavorful', sortOrder: 4 },
      { name: 'Salads', description: 'Fresh and healthy', sortOrder: 5 },
      { name: 'Desserts', description: 'Sweet endings', sortOrder: 6 },
      { name: 'Drinks', description: 'Refreshing beverages', sortOrder: 7 },
    ]);

    await Food.insertMany([
      { name: 'Garlic Bread', description: 'Crispy bread with garlic butter and herbs', price: 9000, category: categories[0]._id, ingredients: ['Bread', 'Garlic', 'Butter', 'Herbs'], tags: ['vegetarian', 'starter'], preparationTime: 10, isFeatured: true },
      { name: 'Mozzarella Sticks', description: 'Golden fried cheese with marinara sauce', price: 12000, category: categories[0]._id, ingredients: ['Mozzarella', 'Breadcrumbs', 'Marinara'], tags: ['vegetarian', 'fried'], preparationTime: 12 },
      { name: 'Chicken Wings', description: 'Crispy wings tossed in buffalo sauce', price: 15000, category: categories[0]._id, ingredients: ['Chicken', 'Buffalo Sauce', 'Celery', 'Blue Cheese'], tags: ['spicy', 'popular'], preparationTime: 15, isFeatured: true },
      { name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce', price: 35000, category: categories[1]._id, ingredients: ['Salmon', 'Lemon', 'Butter', 'Asparagus'], tags: ['seafood', 'healthy'], preparationTime: 20, isFeatured: true },
      { name: 'Chicken Alfredo Pasta', description: 'Creamy pasta with grilled chicken', price: 25000, category: categories[1]._id, ingredients: ['Pasta', 'Chicken', 'Cream', 'Parmesan', 'Garlic'], tags: ['pasta', 'creamy'], preparationTime: 18 },
      { name: 'Beef Steak', description: '8oz ribeye with mashed potatoes', price: 42000, category: categories[1]._id, ingredients: ['Beef', 'Potatoes', 'Butter', 'Herbs'], tags: ['premium', 'grilled'], preparationTime: 25, isFeatured: true },
      { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 22000, category: categories[2]._id, ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'], tags: ['vegetarian', 'classic'], preparationTime: 15, isFeatured: true },
      { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', price: 28000, category: categories[2]._id, ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni'], tags: ['meat', 'popular'], preparationTime: 15 },
      { name: 'Classic Burger', description: 'Angus beef patty with lettuce, tomato, and fries', price: 20000, category: categories[3]._id, ingredients: ['Beef', 'Lettuce', 'Tomato', 'Onion', 'Brioche Bun'], tags: ['classic', 'popular'], preparationTime: 12, isFeatured: true },
      { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, and cheddar', price: 25000, category: categories[3]._id, ingredients: ['Beef', 'Bacon', 'BBQ Sauce', 'Cheddar', 'Onion Rings'], tags: ['bacon', 'bbq'], preparationTime: 14 },
      { name: 'Caesar Salad', description: 'Romaine lettuce with parmesan and croutons', price: 15000, category: categories[4]._id, ingredients: ['Romaine', 'Parmesan', 'Croutons', 'Caesar Dressing'], tags: ['healthy', 'light'], preparationTime: 8 },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 14000, category: categories[5]._id, ingredients: ['Chocolate', 'Butter', 'Eggs', 'Sugar'], tags: ['dessert', 'chocolate'], preparationTime: 15, isFeatured: true },
      { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 12000, category: categories[5]._id, ingredients: ['Mascarpone', 'Coffee', 'Ladyfingers', 'Cocoa'], tags: ['dessert', 'coffee'], preparationTime: 5 },
      { name: 'Fresh Lemonade', description: 'Hand-squeezed lemonade with mint', price: 5000, category: categories[6]._id, ingredients: ['Lemon', 'Sugar', 'Mint', 'Water'], tags: ['drink', 'refreshing'], preparationTime: 5 },
      { name: 'Mango Smoothie', description: 'Blended mango with yogurt and honey', price: 8000, category: categories[6]._id, ingredients: ['Mango', 'Yogurt', 'Honey', 'Ice'], tags: ['drink', 'fruit'], preparationTime: 5 },
    ]);

    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        restaurantName: 'Qalanjo Fast Food',
        tagline: 'Fast food, served fresh to your door',
        address: '123 Main Street, Kampala, Uganda',
        phone: '+256700123456',
        email: 'info@qalanjo.com',
        openingHours: [
          { day: 'Monday', open: '09:00', close: '22:00' },
          { day: 'Tuesday', open: '09:00', close: '22:00' },
          { day: 'Wednesday', open: '09:00', close: '22:00' },
          { day: 'Thursday', open: '09:00', close: '22:00' },
          { day: 'Friday', open: '09:00', close: '23:00' },
          { day: 'Saturday', open: '10:00', close: '23:00' },
          { day: 'Sunday', open: '10:00', close: '21:00' },
        ],
        deliveryFee: 3000,
        taxRate: 0.18,
      });
    }

    res.json({ message: 'Database seeded successfully', admin: { email: adminEmail, password: adminPassword } });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

module.exports = router;
