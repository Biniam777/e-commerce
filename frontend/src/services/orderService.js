import { apiRequest } from './apiClient.js';

const createOrder = ({ shippingName, shippingPhone, shippingAddress }) =>
  apiRequest('/orders', {
    method: 'POST',
    body: { shippingName, shippingPhone, shippingAddress }
  });

const getOrders = () => apiRequest('/orders');

const getOrderById = (id) => apiRequest(`/orders/${id}`);

export { createOrder, getOrders, getOrderById };
