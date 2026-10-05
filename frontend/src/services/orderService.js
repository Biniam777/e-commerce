import { apiRequest } from './apiClient.js';

const createOrder = ({ shippingName, shippingPhone, shippingAddress }) =>
  apiRequest('/orders', {
    method: 'POST',
    body: { shippingName, shippingPhone, shippingAddress }
  });

export { createOrder };