// delicious-food Frontend — API Centralized Service
// Live Express backend connectivity (no demo/mock fallback).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ─── AUTH TOKEN HELPERS ──────────────────────────────────────────
export const getAuthHeaders = () => {
  const token = localStorage.getItem('df_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Core fetch wrapper. Throws an Error (with the server message) on any
 * non-2xx response or network failure — callers handle the error in the UI.
 * @param {string} endpoint - path beginning with `/`
 * @param {RequestInit} [options]
 * @returns {Promise<any>} parsed JSON response body
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const responseText = await response.text();

  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: `Unexpected server response (${response.status})` };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (HTTP ${response.status})`);
  }

  return data;
}

// ─── EXPORTED API METHODS ────────────────────────────────────────

// 1. Authentication
export const authService = {
  /** Login and persist the JWT + user. */
  login: async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('df_token', res.token);
      localStorage.setItem('df_user', JSON.stringify(res.data || res.user));
    }
    return { ...res, user: res.data || res.user };
  },

  /** Register a new account (customer or owner). */
  signup: async (formData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (res.token) {
      localStorage.setItem('df_token', res.token);
      localStorage.setItem('df_user', JSON.stringify(res.data || res.user));
    }
    return { ...res, user: res.data || res.user };
  },

  /** Fetch the currently authenticated user from the server. */
  fetchMe: async () => {
    const res = await apiRequest('/auth/me');
    if (res.data) localStorage.setItem('df_user', JSON.stringify(res.data));
    return res.data;
  },

  /** Update the logged-in user's own profile (name, phone, avatar). */
  updateProfile: async (fields) => {
    const res = await apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    if (res.data) localStorage.setItem('df_user', JSON.stringify(res.data));
    return res.data;
  },

  /** Get the logged-in user's wallet balance. */
  getWallet: async () => {
    const res = await apiRequest('/auth/wallet');
    return res.data;
  },

  /** Top up the logged-in user's wallet. */
  topUpWallet: async (amount) => {
    const res = await apiRequest('/auth/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return res.data;
  },

  /** Change the logged-in user's password. */
  updatePassword: async (currentPassword, newPassword) => {
    const res = await apiRequest('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.token) localStorage.setItem('df_token', res.token);
    return res;
  },

  logout: () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('df_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// 2. Super Admin Panel Services
export const adminService = {
  getStats: async () => {
    const res = await apiRequest('/admin/stats');
    return res.data;
  },

  getPendingRestaurants: async () => {
    const res = await apiRequest('/admin/restaurants/pending');
    return res.data;
  },

  approveRestaurant: async (id, status, adminNotes = '') => {
    const res = await apiRequest(`/admin/restaurants/${id}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
    return res.data;
  },

  getUsers: async (search = '', role = '') => {
    let query = `?search=${encodeURIComponent(search)}`;
    if (role) query += `&role=${role}`;
    const res = await apiRequest(`/admin/users${query}`);
    return res.data;
  },

  updateUser: async (id, fields) => {
    const res = await apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    return res.data;
  },

  deleteUser: async (id) => {
    await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
    return true;
  },

  getRestaurantsByStatus: async (status) => {
    const res = await apiRequest(`/admin/restaurants?status=${status}`);
    return res.data;
  },

  getAllRestaurants: async () => {
    const res = await apiRequest('/admin/restaurants');
    return res.data;
  },

  getRestaurantById: async (id) => {
    const res = await apiRequest(`/admin/restaurants/${id}`);
    return res.data;
  },

  updateRestaurant: async (id, fields) => {
    const res = await apiRequest(`/admin/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    return res.data;
  },

  deleteRestaurant: async (id) => {
    await apiRequest(`/admin/restaurants/${id}`, { method: 'DELETE' });
    return true;
  },

  getOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', filters.page);
    if (filters.limit) params.set('limit', filters.limit);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/admin/orders${query}`);
    return res.data;
  },
};

// 3. Customer Panel Services
export const customerService = {
  getApprovedRestaurants: async (search = '', city = '', cuisine = '') => {
    let query = '';
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (city) query += `&city=${encodeURIComponent(city)}`;
    if (cuisine) query += `&cuisine=${encodeURIComponent(cuisine)}`;
    if (query) query = '?' + query.substring(1);
    const res = await apiRequest(`/restaurants${query}`);
    return res.data;
  },

  getRestaurantDetails: async (id) => {
    const res = await apiRequest(`/restaurants/${id}`);
    return res.data;
  },

  getMenuCategories: async (restaurantId) => {
    const res = await apiRequest(`/menu/categories/${restaurantId}`);
    return res.data;
  },

  getMenuItems: async (restaurantId, categoryId = '') => {
    const query = categoryId ? `?category=${categoryId}` : '';
    const res = await apiRequest(`/menu/items/${restaurantId}${query}`);
    return res.data;
  },

  getAvailableTables: async (restaurantId, date, time, partySize) => {
    const res = await apiRequest(
      `/tables/available/${restaurantId}?date=${date}&time=${time}&partySize=${partySize}`
    );
    return res.data;
  },

  createReservation: async (reservationData) => {
    const res = await apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    return res.data;
  },

  getMyReservations: async () => {
    const res = await apiRequest('/reservations/my');
    return res.data;
  },

  cancelReservation: async (id) => {
    await apiRequest(`/reservations/${id}/cancel`, { method: 'PATCH' });
    return true;
  },

  placeOrder: async (orderData) => {
    const res = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return res.data;
  },

  getMyOrders: async () => {
    const res = await apiRequest('/orders');
    return res.data;
  },

  getOrderDetails: async (id) => {
    const res = await apiRequest(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id, reason = '') => {
    await apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    return true;
  },
};

// 4. Favorites Services
export const favoriteService = {
  /** Get the logged-in customer's favorite restaurants. */
  getMyFavorites: async () => {
    const res = await apiRequest('/favorites');
    return res.data;
  },

  /** Add a restaurant to favorites. */
  addFavorite: async (restaurantId) => {
    const res = await apiRequest(`/favorites/${restaurantId}`, { method: 'POST' });
    return res.data;
  },

  /** Remove a restaurant from favorites. */
  removeFavorite: async (restaurantId) => {
    await apiRequest(`/favorites/${restaurantId}`, { method: 'DELETE' });
    return true;
  },
};

// 5. Offers Services
export const offerService = {
  /** Get all active platform-wide offers (customer Offers page). */
  getActiveOffers: async () => {
    const res = await apiRequest('/offers');
    return res.data;
  },

  /** Get offers for one restaurant. */
  getRestaurantOffers: async (restaurantId) => {
    const res = await apiRequest(`/offers/restaurant/${restaurantId}`);
    return res.data;
  },

  /** Owner: get all offers across my restaurants. */
  getMyOffers: async () => {
    const res = await apiRequest('/offers/my');
    return res.data;
  },

  createOffer: async (offerData) => {
    const res = await apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
    return res.data;
  },

  updateOffer: async (id, fields) => {
    const res = await apiRequest(`/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    return res.data;
  },

  deleteOffer: async (id) => {
    await apiRequest(`/offers/${id}`, { method: 'DELETE' });
    return true;
  },
};

// 6. Owner Panel Services
export const ownerService = {
  /** Get the owner's restaurants (first one is the "primary"). */
  getMyRestaurants: async () => {
    const res = await apiRequest('/restaurants/my');
    return res.data;
  },

  /** Register a new restaurant (defaults to pending approval). */
  createRestaurant: async (data) => {
    const res = await apiRequest('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /** Get all orders for one of the owner's restaurants. */
  getRestaurantOrders: async (restaurantId) => {
    const res = await apiRequest(`/orders/restaurant/${restaurantId}`);
    return res.data;
  },

  /** Update an order's status (confirmed, preparing, ready, delivered...). */
  updateOrderStatus: async (orderId, status) => {
    const res = await apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  /** Owner dashboard stats for a restaurant. */
  getStats: async (restaurantId) => {
    const res = await apiRequest(`/orders/restaurant/${restaurantId}/stats`);
    return res.data;
  },

  /** Customers who have ordered from a restaurant. */
  getCustomers: async (restaurantId) => {
    const res = await apiRequest(`/orders/restaurant/${restaurantId}/customers`);
    return res.data;
  },

  // ── Reservations management ─────────────────────────────
  getRestaurantReservations: async (restaurantId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.date) params.set('date', filters.date);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/reservations/restaurant/${restaurantId}${query}`);
    return res.data;
  },

  updateReservationStatus: async (id, status) => {
    const res = await apiRequest(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  // ── Menu management ──────────────────────────────────
  getCategories: async (restaurantId) => {
    const res = await apiRequest(`/menu/categories/${restaurantId}`);
    return res.data;
  },

  createCategory: async (data) => {
    const res = await apiRequest('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  deleteCategory: async (id) => {
    await apiRequest(`/menu/categories/${id}`, { method: 'DELETE' });
    return true;
  },

  getItems: async (restaurantId) => {
    // all=true so owners also see unavailable items
    const res = await apiRequest(`/menu/items/${restaurantId}?all=true`);
    return res.data;
  },

  createItem: async (data) => {
    const res = await apiRequest('/menu/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  updateItem: async (id, fields) => {
    const res = await apiRequest(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    return res.data;
  },

  deleteItem: async (id) => {
    await apiRequest(`/menu/items/${id}`, { method: 'DELETE' });
    return true;
  },
};
