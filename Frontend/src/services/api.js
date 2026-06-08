// delicious-food Frontend - API Centralized Service
// Supports live Express backend connectivity + stateful in-memory mock fallback (Demo Mode)

import { SEED_RESTAURANTS, buildFullPendingList } from '../utils/adminRestaurantData';

const BASE_URL = 'http://localhost:5000/api/v1';

// ─── STATEFUL MOCK DATA (PERSISTS FOR SESSION) ───────────────────
const mockDb = {
  stats: {
    totalRestaurants: 245,
    totalOwners: 328,
    totalCustomers: 2543,
    totalOrders: 8672,
    totalRevenue: 24560
  },
  pendingRestaurants: buildFullPendingList(SEED_RESTAURANTS.filter((r) => r.status === 'pending')),
  rejectedRestaurants: SEED_RESTAURANTS.filter((r) => r.status === 'rejected'),
  approvalHistory: {
    approvedThisWeek: 12,
    rejectedThisWeek: 3,
  },
  rejectedRestaurants: SEED_RESTAURANTS.filter((r) => r.status === 'rejected'),
  approvedRestaurants: [
    {
      _id: 'app_1',
      name: 'The Green Bowl',
      description: 'Healthy organic green salads and superfood bowls made with locally sourced ingredients.',
      restaurantType: 'Restaurant',
      cuisines: 'Italian, Healthy, Salads',
      address: '123 Green Street, Kigali, Rwanda',
      phone: '+1 234 567 890',
      email: 'greenbowl@gmail.com',
      openingHours: '10:00 AM - 11:00 PM',
      status: 'approved',
      rating: '4.8',
      reviews: '230',
      deliveryTime: '30-40 min',
      deliveryFee: 2.99,
      seatsAvailable: 18,
      logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
    {
      _id: 'app_2',
      name: 'Pizza Point',
      description: 'Authentic wood-fired pizzas.',
      restaurantType: 'Fast Food',
      cuisines: 'Italian, Pizza, Fast Food',
      address: '55 Slice Ave, Brooklyn',
      phone: '+1 555-0201',
      email: 'mike@pizzapoint.com',
      openingHours: '10:00 AM - 12:00 AM',
      status: 'approved',
      rating: '4.8',
      reviews: '190',
      deliveryTime: '30-40 min',
      deliveryFee: 1.99,
      seatsAvailable: 8,
      logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80',
    },
    {
      _id: 'app_3',
      name: 'Burger House',
      description: 'Gourmet burgers and fries.',
      restaurantType: 'Fast Food',
      cuisines: 'Burgers, American, Fast Food',
      address: '90 Grill Road, Queens',
      phone: '+1 555-0210',
      email: 'david@burgerhouse.com',
      openingHours: '11:00 AM - 11:00 PM',
      status: 'approved',
      rating: '4.5',
      reviews: '120',
      deliveryTime: '10-20 min',
      deliveryFee: 1.99,
      seatsAvailable: 5,
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80',
    },
    {
      _id: 'app_4',
      name: 'Spice Route',
      description: 'Traditional spice fusions.',
      restaurantType: 'Restaurant',
      cuisines: 'Asian, Chinese, Thai',
      address: '18 Curry Lane, Midtown',
      phone: '+1 555-0198',
      email: 'spiceroute@spiceroute.com',
      openingHours: '11:00 AM - 11:00 PM',
      status: 'approved',
      rating: '4.6',
      reviews: '160',
      deliveryTime: '25-25 min',
      deliveryFee: 2.49,
      seatsAvailable: 10,
      logo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    },
    {
      _id: 'app_5',
      name: 'Ocean Delight',
      description: 'Premium fresh seafood platters.',
      restaurantType: 'Restaurant',
      cuisines: 'Seafood, Grill',
      address: '7 Harbor View Rd, Waterfront',
      phone: '+1 555-0177',
      email: 'emma.chris@oceandelight.com',
      openingHours: '12:00 PM - 10:00 PM',
      status: 'approved',
      rating: '4.9',
      reviews: '310',
      deliveryTime: '20-30 min',
      deliveryFee: 2.99,
      seatsAvailable: 15,
      logo: 'https://images.unsplash.com/photo-1534080391025-09795d197a5b?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    },
    {
      _id: 'app_6',
      name: 'Sweet Cravings',
      description: 'Bakery and shakes.',
      restaurantType: 'Cafe',
      cuisines: 'Seafood, Grill',
      address: '42 Sweet Blvd, Kigali',
      phone: '+1 555-0322',
      email: 'sweetcravings@gmail.com',
      openingHours: '09:00 AM - 09:00 PM',
      status: 'approved',
      rating: '4.8',
      reviews: '85',
      deliveryTime: '20-30 min',
      deliveryFee: 2.99,
      seatsAvailable: 20,
      logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80',
    }
  ],
  users: [
    { _id: 'u_1', name: 'Super Admin', email: 'admin@delicious.com', role: 'admin', isActive: true },
    { _id: 'u_2', name: 'Sarah M.', email: 'sarah.m@greenbowl.com', role: 'owner', isActive: true },
    { _id: 'u_3', name: 'Priya R.', email: 'priya.r@spiceroute.com', role: 'owner', isActive: true },
    { _id: 'u_4', name: 'James K.', email: 'james.k@gmail.com', role: 'customer', isActive: true },
    { _id: 'u_5', name: 'Emma Watson', email: 'emma@gmail.com', role: 'customer', isActive: false },
    { _id: 'u_6', name: 'Chef Gordon', email: 'gordon@ramsay.com', role: 'owner', isActive: true }
  ],
  activities: [
    { id: 'act_1', text: 'New Restaurant "The Green Bowl" is pending Approval', type: 'pending', time: '2 min ago' },
    { id: 'act_2', text: 'Menu updated for "Burger House"', type: 'update', time: '8 min ago' },
    { id: 'act_3', text: 'Menu updated for "Spice Route"', type: 'update', time: '15 min ago' },
    { id: 'act_4', text: 'Restaurant "Pizza Point" approved', type: 'approval', time: '25 min ago' }
  ]
};

// LocalStorage helpers to persist across page reloads (in Demo Mode)
const getPersistedData = (key, defaultVal) => {
  const data = localStorage.getItem(`df_mock_${key}`);
  return data ? JSON.parse(data) : defaultVal;
};

const setPersistedData = (key, val) => {
  localStorage.setItem(`df_mock_${key}`, JSON.stringify(val));
};

// Initialize DB with persisted local data if available
const loadDb = () => {
  return {
    stats: getPersistedData('stats', mockDb.stats),
    allRestaurants: getPersistedData('allRestaurants', mockDb.allRestaurants),
    pendingRestaurants: getPersistedData('pendingRestaurants', mockDb.pendingRestaurants),
    approvedRestaurants: getPersistedData('approvedRestaurants', mockDb.approvedRestaurants),
    rejectedRestaurants: getPersistedData('rejectedRestaurants', SEED_RESTAURANTS.filter((r) => r.status === 'rejected')),
    users: getPersistedData('users', mockDb.users),
    activities: getPersistedData('activities', mockDb.activities),
    approvalHistory: getPersistedData('approvalHistory', mockDb.approvalHistory),
    orders: getPersistedData('orders', []),
    reservations: getPersistedData('reservations', []),
  };
};

// Write changes back to LocalStorage
const saveDb = (db) => {
  setPersistedData('stats', db.stats);
  setPersistedData('allRestaurants', db.allRestaurants);
  setPersistedData('pendingRestaurants', db.pendingRestaurants);
  setPersistedData('approvedRestaurants', db.approvedRestaurants);
  setPersistedData('rejectedRestaurants', db.rejectedRestaurants);
  setPersistedData('users', db.users);
  setPersistedData('activities', db.activities);
  setPersistedData('approvalHistory', db.approvalHistory);
  setPersistedData('orders', db.orders);
  setPersistedData('reservations', db.reservations);
};

// ─── AUTH TOKEN HELPERS ──────────────────────────────────────────
export const getAuthHeaders = () => {
  const token = localStorage.getItem('df_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    const responseText = await response.text();
    
    let data = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        
        data = { message: `Server error format (${response.status})` };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    
    return data;

  } catch (err) {
    console.warn(`[api.js] live connection failed for ${endpoint}. Falling back to Demo Mode:`, err.message);
    throw err;
  }
}


// ─── EXPORTED API METHODS ────────────────────────────────────────

// 1. Authentication
export const authService = {
  login: async (email, password) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        localStorage.setItem('df_token', res.token);
        localStorage.setItem('df_user', JSON.stringify(res.data || res.user));
      }
      return { ...res, user: res.data || res.user, success: res.success ?? true };
    } catch (err) {
      // Mock Login Fallback
      const db = loadDb();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && password) {
        const mockResponse = {
          success: true,
          token: 'mock_token_jwt_super_admin',
          user: user
        };
        localStorage.setItem('df_token', mockResponse.token);
        localStorage.setItem('df_user', JSON.stringify(mockResponse.user));
        return mockResponse;
      }
      throw new Error('Invalid credentials. (In Demo Mode, try: admin@delicious.com)');
    }
  },
  
  signup: async (formData) => {
    try {
      const res = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.token) {
        localStorage.setItem('df_token', res.token);
        localStorage.setItem('df_user', JSON.stringify(res.data || res.user));
      }
      return { ...res, user: res.data || res.user, success: res.success ?? true };
    } catch (err) {
      // Mock Signup Fallback — create a new user in the local DB
      const db = loadDb();
      const exists = db.users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      if (exists) {
        throw new Error('A user with this email already exists');
      }
      const newUser = {
        _id: `u_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role || 'customer',
        isActive: true,
      };
      db.users.push(newUser);
      saveDb(db);

      const mockResponse = {
        success: true,
        token: `mock_jwt_${newUser.role}`,
        user: newUser,
      };
      localStorage.setItem('df_token', mockResponse.token);
      localStorage.setItem('df_user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }
  },

  logout: () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('df_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// 2. Super Admin Panel Services
export const adminService = {
  // Get platform-wide overview statistics
  getStats: async () => {
    try {
      const res = await apiRequest('/admin/stats');
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      return db.stats;
    }
  },

  // Get pending restaurants for approval
  getPendingRestaurants: async () => {
    try {
      const res = await apiRequest('/admin/restaurants/pending');
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      return db.pendingRestaurants;
    }
  },

  // Approve or reject restaurant
  approveRestaurant: async (id, status, adminNotes = '') => {
    try {
      const res = await apiRequest(`/admin/restaurants/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes })
      });
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.pendingRestaurants.findIndex(r => r._id === id);
      if (idx !== -1) {
        const removed = db.pendingRestaurants[idx];
        db.pendingRestaurants.splice(idx, 1);
        
        const approvedEntry = { ...removed, status: 'approved' };
        db.allRestaurants = db.allRestaurants.filter((r) => r._id !== id);
        db.allRestaurants.push(approvedEntry);

        if (status === 'approved') {
          db.stats.totalRestaurants += 1;
          db.approvalHistory.approvedThisWeek += 1;
          db.approvedRestaurants.push({
            _id: removed._id,
            name: removed.name,
            rating: '5.0',
            reviews: '0',
            orders: 0,
            revenue: 0,
            cuisines: removed.cuisineType,
            restaurantType: removed.restaurantType,
            owner: removed.owner,
            status: 'approved',
          });
          db.activities.unshift({
            id: `act_${Date.now()}`,
            text: `Restaurant "${removed.name}" approved`,
            type: 'approval',
            time: 'Just now'
          });
        } else {
          db.approvalHistory.rejectedThisWeek += 1;
          const rejectedEntry = { ...removed, status: 'rejected' };
          db.rejectedRestaurants.push(rejectedEntry);
          db.allRestaurants.push(rejectedEntry);
          db.activities.unshift({
            id: `act_${Date.now()}`,
            text: `Restaurant "${removed.name}" rejected. Notes: ${adminNotes}`,
            type: 'rejection',
            time: 'Just now'
          });
        }
        
        saveDb(db);
        return { ...removed, status, adminNotes };
      }
      throw new Error('Restaurant not found in pending list');
    }
  },

  // Get all users
  getUsers: async (search = '', role = '') => {
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (role) query += `&role=${role}`;
      const res = await apiRequest(`/admin/users${query}`);
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      let filtered = [...db.users];
      if (role) {
        filtered = filtered.filter(u => u.role === role);
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(u => 
          u.name.toLowerCase().includes(term) || 
          u.email.toLowerCase().includes(term)
        );
      }
      return filtered;
    }
  },

  // Update user role or active status
  updateUser: async (id, fields) => {
    try {
      const res = await apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields)
      });
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...fields };
        
        // Track stats changes if user role toggled
        let ownersCount = db.users.filter(u => u.role === 'owner').length;
        let customersCount = db.users.filter(u => u.role === 'customer').length;
        db.stats.totalOwners = 328 + (ownersCount - 3); // relative to base screenshot stats
        db.stats.totalCustomers = 2543 + (customersCount - 2);

        saveDb(db);
        return db.users[idx];
      }
      throw new Error('User not found');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        const deleted = db.users[idx];
        db.users.splice(idx, 1);
        
        db.stats.totalUsers = db.users.length + 2800; // Keep scale aligned

        db.activities.unshift({
          id: `act_${Date.now()}`,
          text: `User "${deleted.name}" (${deleted.role}) deleted`,
          type: 'deletion',
          time: 'Just now'
        });
        
        saveDb(db);
        return true;
      }
      throw new Error('User not found');
    }
  },

  // Get recent activities list
  getRecentActivities: async () => {
    const db = loadDb();
    return db.activities;
  },

  getRestaurantsByStatus: async (status) => {
    try {
      const res = await apiRequest(`/admin/restaurants?status=${status}`);
      return res.data;
    } catch {
      const db = loadDb();
      if (status === 'pending') return db.pendingRestaurants;
      if (status === 'approved') return db.approvedRestaurants;
      if (status === 'rejected') return db.rejectedRestaurants;
      return db.allRestaurants;
    }
  },

  getAllRestaurants: async () => {
    try {
      const res = await apiRequest('/admin/restaurants');
      return res.data;
    } catch {
      const db = loadDb();
      const approved = db.approvedRestaurants.map((r) => ({ ...r, status: r.status || 'approved' }));
      const rejected = (db.rejectedRestaurants || []).map((r) => ({ ...r, status: 'rejected' }));
      const pending = db.pendingRestaurants.map((r) => ({ ...r, status: r.status || 'pending' }));
      const seen = new Set();
      return [...pending, ...approved, ...rejected].filter((r) => {
        if (seen.has(r._id)) return false;
        seen.add(r._id);
        return true;
      });
    }
  },

  getRestaurantById: async (id) => {
    try {
      const res = await apiRequest(`/admin/restaurants/${id}`);
      return res.data;
    } catch {
      const db = loadDb();
      const all = [
        ...db.pendingRestaurants,
        ...db.approvedRestaurants,
        ...(db.rejectedRestaurants || []),
        ...db.allRestaurants,
      ];
      const found = all.find((r) => r._id === id);
      if (found) return found;
      throw new Error('Restaurant not found');
    }
  },

  updateRestaurant: async (id, fields) => {
    try {
      const res = await apiRequest(`/admin/restaurants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields),
      });
      return res.data;
    } catch {
      const db = loadDb();
      const lists = ['pendingRestaurants', 'approvedRestaurants', 'rejectedRestaurants', 'allRestaurants'];
      for (const key of lists) {
        if (!db[key]) continue;
        const idx = db[key].findIndex((r) => r._id === id);
        if (idx !== -1) {
          db[key][idx] = { ...db[key][idx], ...fields };
          saveDb(db);
          return db[key][idx];
        }
      }
      throw new Error('Restaurant not found');
    }
  },

  deleteRestaurant: async (id) => {
    try {
      await apiRequest(`/admin/restaurants/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const db = loadDb();
      const lists = ['pendingRestaurants', 'approvedRestaurants', 'rejectedRestaurants', 'allRestaurants'];
      for (const key of lists) {
        if (!db[key]) continue;
        const idx = db[key].findIndex((r) => r._id === id);
        if (idx !== -1) {
          db[key].splice(idx, 1);
          saveDb(db);
          return true;
        }
      }
      throw new Error('Restaurant not found');
    }
  },
};

// 3. Customer Panel Services
export const customerService = {
  // Get all approved restaurants
  getApprovedRestaurants: async (search = '', city = '', cuisine = '') => {
    try {
      let query = '';
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (city) query += `&city=${encodeURIComponent(city)}`;
      if (cuisine) query += `&cuisine=${encodeURIComponent(cuisine)}`;
      if (query) query = '?' + query.substring(1);
      const res = await apiRequest(`/restaurants${query}`);
      return res.data;
    } catch {
      const db = loadDb();
      let list = [...db.approvedRestaurants];
      if (city) {
        list = list.filter((r) => r.address.toLowerCase().includes(city.toLowerCase()));
      }
      if (cuisine && cuisine !== 'All') {
        list = list.filter((r) => r.cuisines.toLowerCase().includes(cuisine.toLowerCase()));
      }
      if (search) {
        const term = search.toLowerCase();
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            r.cuisines.toLowerCase().includes(term) ||
            (r.description && r.description.toLowerCase().includes(term))
        );
      }
      return list;
    }
  },

  getRestaurantDetails: async (id) => {
    try {
      const res = await apiRequest(`/restaurants/${id}`);
      return res.data;
    } catch {
      const db = loadDb();
      const found = db.approvedRestaurants.find((r) => r._id === id);
      if (found) return found;
      throw new Error('Restaurant not found');
    }
  },

  getMenuCategories: async (restaurantId) => {
    try {
      const res = await apiRequest(`/menu/categories/${restaurantId}`);
      return res.data;
    } catch {
      // Return static mock categories matching screenshots
      return [
        { _id: 'cat_1', name: 'Pizza', sortOrder: 1, restaurant: restaurantId },
        { _id: 'cat_2', name: 'Burgers', sortOrder: 2, restaurant: restaurantId },
        { _id: 'cat_3', name: 'Salads', sortOrder: 3, restaurant: restaurantId },
        { _id: 'cat_4', name: 'Drinks', sortOrder: 4, restaurant: restaurantId },
        { _id: 'cat_5', name: 'Desserts', sortOrder: 5, restaurant: restaurantId },
      ];
    }
  },

  getMenuItems: async (restaurantId, categoryId = '') => {
    try {
      let query = '';
      if (categoryId) query = `?category=${categoryId}`;
      const res = await apiRequest(`/menu/items/${restaurantId}${query}`);
      return res.data;
    } catch {
      // Rich mock menu items with Unsplash photos, matching exactly the screenshots!
      const items = [
        {
          _id: 'item_1',
          name: 'Pepperoni Pizza',
          description: 'Medium, Extra Cheese. Premium pepperoni and mozzarella cheese topping.',
          price: 14.99,
          category: 'cat_1',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_2',
          name: 'Margherita Pizza',
          description: 'Classic delight with 100% real mozzarella cheese and fresh basil.',
          price: 12.99,
          category: 'cat_1',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_3',
          name: 'Beef Burger',
          description: 'Gourmet double beef patty, cheddar, lettuce, tomatoes and special house sauce.',
          price: 11.49,
          category: 'cat_2',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_4',
          name: 'Grilled Chicken',
          description: 'Tender flame-grilled chicken breast, avocado, Swiss cheese, and aioli on brioche.',
          price: 11.49,
          category: 'cat_2',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_5',
          name: 'Quinoa Veggie Bowl',
          description: 'Organic red quinoa, roasted sweet potatoes, avocado, spinach, and sesame dressing.',
          price: 11.49,
          category: 'cat_3',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_6',
          name: 'Pasta Primavera',
          description: 'Penne pasta tossed in garlic olive oil with broccoli, cherry tomatoes, and parmesan.',
          price: 11.49,
          category: 'cat_3',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_7',
          name: 'Avocado Toast',
          description: 'Smashed avocado, poached egg, pumpkin seeds, and chili flakes on sourdough.',
          price: 11.49,
          category: 'cat_3',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_8',
          name: 'Chocolate Shake',
          description: 'Medium. Thick organic dark chocolate shake topped with chocolate drizzle.',
          price: 14.99,
          category: 'cat_4',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80' },
          isAvailable: true,
        },
        {
          _id: 'item_9',
          name: 'Sweet Cravings Cake',
          description: 'Warm fudge cake with fresh strawberries and vanilla glaze.',
          price: 6.99,
          category: 'cat_5',
          restaurant: restaurantId,
          image: { url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80' },
          isAvailable: true,
        },
      ];
      if (categoryId) return items.filter((i) => i.category === categoryId);
      return items;
    }
  },

  getAvailableTables: async (restaurantId, date, time, partySize) => {
    try {
      const res = await apiRequest(`/tables/available/${restaurantId}?date=${date}&time=${time}&partySize=${partySize}`);
      return res.data;
    } catch {
      // Default mock available tables: Kigali floor layout tables
      return [
        { _id: 'tab_B1', tableNumber: 'B1', capacity: 2, restaurant: restaurantId, isActive: true },
        { _id: 'tab_B2', tableNumber: 'B2', capacity: 4, restaurant: restaurantId, isActive: true },
        { _id: 'tab_B3', tableNumber: 'B3', capacity: 6, restaurant: restaurantId, isActive: true },
        { _id: 'tab_B4', tableNumber: 'B4', capacity: 8, restaurant: restaurantId, isActive: true },
      ];
    }
  },

  createReservation: async (reservationData) => {
    try {
      const res = await apiRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData),
      });
      return res.data;
    } catch {
      const db = loadDb();
      const newRes = {
        _id: `res_${Date.now()}`,
        ...reservationData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      db.reservations.push(newRes);
      saveDb(db);
      return newRes;
    }
  },

  getMyReservations: async () => {
    try {
      const res = await apiRequest('/reservations/my');
      return res.data;
    } catch {
      const db = loadDb();
      // Populate restaurant objects for mock rendering
      return db.reservations.map((r) => {
        const rest = db.approvedRestaurants.find((item) => item._id === r.restaurant);
        return {
          ...r,
          restaurant: rest || { name: 'The Green Bowl', address: '123 Green Street, Kigali' },
        };
      });
    }
  },

  cancelReservation: async (id) => {
    try {
      await apiRequest(`/reservations/${id}/cancel`, { method: 'PATCH' });
      return true;
    } catch {
      const db = loadDb();
      const idx = db.reservations.findIndex((r) => r._id === id);
      if (idx !== -1) {
        db.reservations[idx].status = 'cancelled';
        saveDb(db);
        return true;
      }
      throw new Error('Reservation not found');
    }
  },

  placeOrder: async (orderData) => {
    try {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return res.data;
    } catch {
      const db = loadDb();
      const newOrder = {
        _id: `ord_${Date.now()}`,
        orderNumber: `DF-${Math.floor(100000 + Math.random() * 900000)}`,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      db.orders.push(newOrder);
      // Update stats and deduct wallet mock balance
      db.stats.totalOrders += 1;
      db.stats.totalRevenue += orderData.totalAmount || 0;
      saveDb(db);
      return newOrder;
    }
  },

  getMyOrders: async () => {
    try {
      const res = await apiRequest('/orders');
      return res.data;
    } catch {
      const db = loadDb();
      return db.orders.map((o) => {
        const rest = db.approvedRestaurants.find((item) => item._id === o.restaurant);
        return {
          ...o,
          restaurant: rest || { name: 'The Green Bowl', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80' },
        };
      });
    }
  },

  getOrderDetails: async (id) => {
    try {
      const res = await apiRequest(`/orders/${id}`);
      return res.data;
    } catch {
      const db = loadDb();
      const found = db.orders.find((o) => o._id === id);
      if (found) {
        const rest = db.approvedRestaurants.find((item) => item._id === found.restaurant);
        return {
          ...found,
          restaurant: rest || { name: 'The Green Bowl', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80' },
        };
      }
      throw new Error('Order not found');
    }
  },

  cancelOrder: async (id, reason = '') => {
    try {
      await apiRequest(`/orders/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      return true;
    } catch {
      const db = loadDb();
      const idx = db.orders.findIndex((o) => o._id === id);
      if (idx !== -1) {
        db.orders[idx].status = 'cancelled';
        db.orders[idx].cancelReason = reason;
        saveDb(db);
        return true;
      }
      throw new Error('Order not found');
    }
  },
};
