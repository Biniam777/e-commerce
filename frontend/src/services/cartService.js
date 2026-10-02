import { apiRequest } from './apiClient.js';

const getCart = () => apiRequest('/cart');

const addCartItem = (productId, quantity = 1) =>
  apiRequest('/cart/items', {
    method: 'POST',
    body: { productId, quantity }
  });

const updateCartItem = (itemId, quantity) =>
  apiRequest(`/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: { quantity }
  });

const removeCartItem = (itemId) =>
  apiRequest(`/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE'
  });

export { addCartItem, getCart, removeCartItem, updateCartItem };