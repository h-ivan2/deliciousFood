import {
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
  IMG_FOOD_ACCENT,
  IMG_HERO_BG,
} from '../constants/images';

export const RESTAURANT_IMAGES = {
  'The Green Bowl': IMG_REST_GREEN_BOWL,
  'Spice Route': IMG_REST_SPICE_ROUTE,
  'Ocean Delight': IMG_REST_OCEAN_DELIGHT,
  'Pizza Point': IMG_REST_PIZZA_POINT,
  'Burger House': IMG_REST_BURGER_HOUSE,
};

export const TABLE_BG_IMAGE = IMG_HERO_BG;

export function getRestaurantImage(rest) {
  return RESTAURANT_IMAGES[rest?.name] || IMG_FOOD_ACCENT;
}

export function formatTableDate(dateStr) {
  if (!dateStr) return '—';
  if (!dateStr.includes('T')) return dateStr;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDetailSubmitted(dateStr) {
  if (!dateStr) return 'Recently';
  if (!dateStr.includes('T')) return dateStr;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/** Seed data aligned with Figma screens */
export const SEED_RESTAURANTS = [
  {
    _id: 'pending_1',
    name: 'The Green Bowl',
    description: 'Healthy organic green salads and superfood bowls made with locally sourced ingredients.',
    restaurantType: 'Cafe',
    cuisineType: 'Healthy, Salad',
    address: '123 Green Street, New York, USA',
    phone: '+1 234 567 890',
    email: 'johndoe@gmail.com',
    openingHours: '09:00 AM - 10:00 PM',
    status: 'pending',
    owner: { _id: 'owner_1', name: 'John Doe', email: 'johndoe@gmail.com', phone: '+1 234 567 890' },
    createdAt: '2024-05-02T10:30:00.000Z',
    photos: [IMG_REST_GREEN_BOWL, IMG_FOOD_ACCENT, IMG_REST_SPICE_ROUTE, IMG_REST_PIZZA_POINT],
    menuPreview: [IMG_REST_BURGER_HOUSE, IMG_REST_PIZZA_POINT, IMG_REST_OCEAN_DELIGHT, IMG_REST_GREEN_BOWL],
  },
  {
    _id: 'pending_2',
    name: 'Spice Route',
    description: 'Exotic Indian dining and traditional spice fusions with authentic regional recipes.',
    restaurantType: 'Restaurant',
    cuisineType: 'Indian, Curry',
    address: '18 Curry Lane, Midtown',
    phone: '+1 555-0198',
    email: 'sarah.evans@spiceroute.com',
    openingHours: '11:00 AM - 11:00 PM',
    status: 'pending',
    owner: { _id: 'owner_2', name: 'Sarah Evans', email: 'sarah.evans@spiceroute.com', phone: '+1 555-0198' },
    createdAt: '2024-05-02T14:00:00.000Z',
    photos: [IMG_REST_SPICE_ROUTE, IMG_FOOD_ACCENT, IMG_REST_GREEN_BOWL, IMG_REST_PIZZA_POINT],
    menuPreview: [IMG_REST_SPICE_ROUTE, IMG_REST_BURGER_HOUSE, IMG_REST_PIZZA_POINT, IMG_REST_OCEAN_DELIGHT],
  },
  {
    _id: 'pending_3',
    name: 'Pizza Point',
    description: 'Authentic wood-fired pizzas and Italian classics.',
    restaurantType: 'Fast Food',
    cuisineType: 'Pizza, Italian',
    address: '55 Slice Ave, Brooklyn',
    phone: '+1 555-0201',
    email: 'mike.johnson@pizzapoint.com',
    openingHours: '10:00 AM - 12:00 AM',
    status: 'pending',
    owner: { _id: 'owner_3', name: 'Mike Johnson', email: 'mike.johnson@pizzapoint.com', phone: '+1 555-0201' },
    createdAt: '2024-05-01T09:15:00.000Z',
    photos: [IMG_REST_PIZZA_POINT, IMG_FOOD_ACCENT, IMG_REST_BURGER_HOUSE, IMG_REST_SPICE_ROUTE],
    menuPreview: [IMG_REST_PIZZA_POINT, IMG_REST_BURGER_HOUSE, IMG_REST_GREEN_BOWL, IMG_REST_OCEAN_DELIGHT],
  },
  {
    _id: 'pending_4',
    name: 'Burger House',
    description: 'Gourmet burgers, crispy fries, and classic American comfort food.',
    restaurantType: 'Fast Food',
    cuisineType: 'Burgers, American',
    address: '90 Grill Road, Queens',
    phone: '+1 555-0210',
    email: 'david.smith@burgerhouse.com',
    openingHours: '11:00 AM - 11:00 PM',
    status: 'pending',
    owner: { _id: 'owner_4', name: 'David Smith', email: 'david.smith@burgerhouse.com', phone: '+1 555-0210' },
    createdAt: '2024-04-30T16:45:00.000Z',
    photos: [IMG_REST_BURGER_HOUSE, IMG_FOOD_ACCENT, IMG_REST_PIZZA_POINT, IMG_REST_GREEN_BOWL],
    menuPreview: [IMG_REST_BURGER_HOUSE, IMG_REST_PIZZA_POINT, IMG_REST_SPICE_ROUTE, IMG_REST_OCEAN_DELIGHT],
  },
  {
    _id: 'pending_5',
    name: 'Ocean Delight',
    description: 'Premium fresh seafood platters and ocean delicacies served daily.',
    restaurantType: 'Sea Food',
    cuisineType: 'Seafood',
    address: '7 Harbor View Rd, Waterfront',
    phone: '+1 555-0177',
    email: 'emma.chris@oceandelight.com',
    openingHours: '12:00 PM - 10:00 PM',
    status: 'pending',
    owner: { _id: 'owner_5', name: 'Emma Chris', email: 'emma.chris@oceandelight.com', phone: '+1 555-0177' },
    createdAt: '2024-04-30T11:20:00.000Z',
    photos: [IMG_REST_OCEAN_DELIGHT, IMG_FOOD_ACCENT, IMG_REST_GREEN_BOWL, IMG_REST_SPICE_ROUTE],
    menuPreview: [IMG_REST_OCEAN_DELIGHT, IMG_REST_BURGER_HOUSE, IMG_REST_PIZZA_POINT, IMG_REST_SPICE_ROUTE],
  },
  {
    _id: 'app_1',
    name: 'Pizza Point',
    description: 'Authentic wood-fired pizzas.',
    restaurantType: 'Fast Food',
    cuisineType: 'Pizza, Italian',
    address: '55 Slice Ave',
    phone: '+1 555-0201',
    email: 'mike@pizzapoint.com',
    status: 'approved',
    owner: { name: 'Mike Johnson', email: 'mike@pizzapoint.com' },
    createdAt: '2024-04-15T08:00:00.000Z',
    rating: '4.7',
    orders: 987,
    revenue: 2980,
  },
  {
    _id: 'app_2',
    name: 'Burger House',
    description: 'Gourmet burgers and fries.',
    restaurantType: 'Fast Food',
    cuisineType: 'Burgers, American',
    address: '90 Grill Road',
    phone: '+1 555-0210',
    email: 'david@burgerhouse.com',
    status: 'approved',
    owner: { name: 'David Smith', email: 'david@burgerhouse.com' },
    createdAt: '2024-04-10T08:00:00.000Z',
    rating: '4.9',
    orders: 876,
    revenue: 2340,
  },
  {
    _id: 'rej_1',
    name: 'Ocean Delight',
    description: 'Seafood restaurant — rejected due to incomplete documentation.',
    restaurantType: 'Sea Food',
    cuisineType: 'Seafood',
    address: '7 Harbor View Rd',
    phone: '+1 555-0177',
    email: 'emma@oceandelight.com',
    status: 'rejected',
    owner: { name: 'Emma Chris', email: 'emma@oceandelight.com' },
    createdAt: '2024-04-28T08:00:00.000Z',
  },
];

/** Extra pending rows so pagination shows 18 total (Figma) */
export function buildFullPendingList(pending) {
  if (pending.length >= 18) return pending;
  const extras = [];
  const templates = pending.slice(0, 5);
  for (let i = pending.length; i < 18; i++) {
    const t = templates[i % templates.length];
    extras.push({
      ...t,
      _id: `pending_extra_${i}`,
      name: `${t.name} ${i > 9 ? '' : '#' + (i + 1)}`.trim(),
      createdAt: new Date(2024, 3, 28 - (i % 10)).toISOString(),
    });
  }
  return [...pending, ...extras];
}

export function paginate(items, page, perPage = 5) {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / perPage)),
    page,
    perPage,
    from: items.length ? start + 1 : 0,
    to: Math.min(start + perPage, items.length),
  };
}
