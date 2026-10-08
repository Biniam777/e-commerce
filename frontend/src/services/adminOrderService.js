import { apiRequest } from './apiClient.js';

const getAdminOrders = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(
    `/admin/orders${queryString ? `?${queryString}` : ''}`
  );
};

const getAdminOrderById = (id) =>
  apiRequest(`/admin/orders/${encodeURIComponent(id)}`);

const updateAdminOrderStatus = (id, status) =>
  apiRequest(`/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { status }
  });

export {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderStatus
};
