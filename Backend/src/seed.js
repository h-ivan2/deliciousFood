/**
 * Database seed script for Delicious Food.
 * Creates an admin, sample owners + customers, approved restaurants,
 * menu categories/items, and a few active offers — so the app has real
 * data to work against (no more demo/mock fallback).
 *
 * Run with:  npm run seed
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./models/user.model');
const Restaurant = require('./models/restaurant.model');
const MenuCategory = require('./models/menuCategory.model');
const MenuItem = require('./models/menuItem.model');
const Offer = require('./models/offer.model');

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set. Add it to your .env file.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Wipe existing data (development only)
  await Promise.all([
    User.deleteMany({}),
    Restaurant.deleteMany({}),
    MenuCategory.deleteMany({}),
    MenuItem.deleteMany({}),
    Offer.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing collections');

  // ── Users ───────────────────────────────────────────────
  // NOTE: passwords are hashed automatically by the user model pre-save hook.
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@delicious.com',
    password: 'admin1234',
    role: 'admin',
  });

  const owner1 = await User.create({
    name: 'Sarah Muteteri',
    email: 'sarah@greenbowl.com',
    password: 'owner1234',
    role: 'owner',
    phone: '+250 788 111 222',
  });

  const owner2 = await User.create({
    name: 'Mario Rossi',
    email: 'mario@pizzapoint.com',
    password: 'owner1234',
    role: 'owner',
    phone: '+250 788 333 444',
  });

  const customer = await User.create({
    name: 'James Karki',
    email: 'james@gmail.com',
    password: 'customer1234',
    role: 'customer',
    phone: '+250 788 555 666',
  });

  console.log('👤 Created users (admin, 2 owners, 1 customer)');

  // ── Restaurants ─────────────────────────────────────────
  const greenBowl = await Restaurant.create({
    owner: owner1._id,
    name: 'The Green Bowl',
    description: 'Healthy organic green salads and superfood bowls made with locally sourced ingredients.',
    cuisine: ['Healthy', 'Salads', 'Italian'],
    address: { street: '123 Green Street', city: 'Kigali', Country: 'Rwanda' },
    phone: '+250 788 111 222',
    email: 'greenbowl@gmail.com',
    logo: { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80' },
    coverImage: { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
    status: 'approved',
    isOpen: true,
    rating: 4.8,
    reviewCount: 230,
    deliveryFee: 2.99,
    estimatedDeliveryTime: 35,
    priceRange: '$$',
  });

  const pizzaPoint = await Restaurant.create({
    owner: owner2._id,
    name: 'Pizza Point',
    description: 'Authentic wood-fired pizzas made fresh to order.',
    cuisine: ['Italian', 'Pizza', 'Fast Food'],
    address: { street: '55 Slice Avenue', city: 'Kigali', Country: 'Rwanda' },
    phone: '+250 788 333 444',
    email: 'mario@pizzapoint.com',
    logo: { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&q=80' },
    coverImage: { url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80' },
    status: 'approved',
    isOpen: true,
    rating: 4.7,
    reviewCount: 190,
    deliveryFee: 1.99,
    estimatedDeliveryTime: 30,
    priceRange: '$$',
  });

  // A pending one so the admin approval queue isn't empty
  await Restaurant.create({
    owner: owner2._id,
    name: 'Ocean Delight',
    description: 'Premium fresh seafood platters.',
    cuisine: ['Seafood', 'Grill'],
    address: { street: '7 Harbor View Rd', city: 'Kigali', Country: 'Rwanda' },
    phone: '+250 788 777 888',
    email: 'ocean@delight.com',
    logo: { url: 'https://images.unsplash.com/photo-1534080391025-09795d197a5b?w=120&q=80' },
    coverImage: { url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80' },
    status: 'pending',
    priceRange: '$$$',
  });

  console.log('🍽️  Created restaurants (2 approved, 1 pending)');

  // ── Menu for The Green Bowl ─────────────────────────────
  const [pizzaCat, saladCat, drinksCat] = await MenuCategory.create([
    { restaurant: greenBowl._id, name: 'Pizza', sortOrder: 1 },
    { restaurant: greenBowl._id, name: 'Salads', sortOrder: 2 },
    { restaurant: greenBowl._id, name: 'Drinks', sortOrder: 3 },
  ]);

  await MenuItem.create([
    {
      restaurant: greenBowl._id, category: pizzaCat._id, name: 'Margherita Pizza',
      description: 'Classic delight with 100% real mozzarella and fresh basil.',
      price: 12.99, isVegetarian: true,
      image: { url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80' },
    },
    {
      restaurant: greenBowl._id, category: saladCat._id, name: 'Quinoa Veggie Bowl',
      description: 'Organic red quinoa, roasted sweet potatoes, avocado, spinach.',
      price: 11.49, isVegetarian: true, isVegan: true,
      image: { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80' },
    },
    {
      restaurant: greenBowl._id, category: drinksCat._id, name: 'Chocolate Shake',
      description: 'Thick organic dark chocolate shake topped with drizzle.',
      price: 5.99,
      image: { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80' },
    },
  ]);

  // ── Menu for Pizza Point ────────────────────────────────
  const [ppPizza] = await MenuCategory.create([
    { restaurant: pizzaPoint._id, name: 'Pizza', sortOrder: 1 },
  ]);

  await MenuItem.create([
    {
      restaurant: pizzaPoint._id, category: ppPizza._id, name: 'Pepperoni Pizza',
      description: 'Premium pepperoni and mozzarella cheese topping.',
      price: 14.99,
      image: { url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
    },
  ]);

  console.log('📋 Created menu categories and items');

  // ── Offers ──────────────────────────────────────────────
  await Offer.create([
    {
      restaurant: greenBowl._id,
      title: '20% Off Your First Order',
      description: 'New here? Enjoy 20% off everything on your first order.',
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 15,
      isActive: true,
    },
    {
      restaurant: pizzaPoint._id,
      title: '$5 Off Pizzas',
      description: 'Get $5 off when you spend $25 or more on pizzas.',
      code: 'PIZZA5',
      discountType: 'fixed',
      discountValue: 5,
      minOrderAmount: 25,
      isActive: true,
    },
  ]);

  console.log('🎁 Created sample offers');

  console.log('\n✅ Seed complete! Login credentials:');
  console.log('   Admin    →  admin@delicious.com/ admin1234');
  console.log('   Owner    →  sarah@greenbowl.com / owner1234');
  console.log('   Customer →  james@gmail.com / customer1234\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});