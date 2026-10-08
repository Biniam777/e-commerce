import { apiRequest } from './apiClient.js';

const processPayment = (orderId, action) =>
  apiRequest(`/orders/${encodeURIComponent(orderId)}/payment`, {
    method: 'POST',
    body: { action }
  });

export { processPayment };
