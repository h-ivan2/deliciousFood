// Admin restaurant UI helpers.
// (Mock seed data has been removed — the app now uses the live backend.)

import {
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

/** Decorative background image used behind admin table panels. */
export const TABLE_BG_IMAGE = IMG_REST_SPICE_ROUTE;

const FALLBACK_IMAGES = [
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
];

/**
 * Resolve a display image for a restaurant.
 * Prefers the restaurant's own cover/logo, otherwise picks a stable
 * fallback based on the name so the UI never shows a broken image.
 * @param {object} restaurant
 * @returns {string} image URL
 */
export function getRestaurantImage(restaurant = {}) {
  if (restaurant.coverImage?.url) return restaurant.coverImage.url;
  if (restaurant.logo?.url) return restaurant.logo.url;
  const name = restaurant.name || '';
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[hash];
}

/**
 * Format a date for compact table rows, e.g. "Jan 5, 2026".
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTableDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date for the approval-detail header, e.g. "January 5, 2026".
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDetailSubmitted(date) {
  if (!date) return 'Unknown date';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Client-side pagination helper.
 * @param {Array} list - full list of items
 * @param {number} page - current 1-based page
 * @param {number} perPage - items per page
 * @returns {{ items: Array, total: number, totalPages: number, from: number, to: number }}
 */
export function paginate(list = [], page = 1, perPage = 5) {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = list.slice(start, start + perPage);
  return {
    items,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + perPage, total),
  };
}
