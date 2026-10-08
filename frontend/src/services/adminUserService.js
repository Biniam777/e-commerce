import { apiRequest } from './apiClient.js';

const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(
    `/admin/users${queryString ? `?${queryString}` : ''}`
  );
};

const getAdminUserById = (id) =>
  apiRequest(`/admin/users/${encodeURIComponent(id)}`);

const updateAdminUserRole = (id, role) =>
  apiRequest(`/admin/users/${encodeURIComponent(id)}/role`, {
    method: 'PATCH',
    body: { role }
  });

export {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserRole
};
