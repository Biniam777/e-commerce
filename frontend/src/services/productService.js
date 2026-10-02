import { apiRequest } from './apiClient.js';

const getProducts = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
};

const getProductBySlug = (slug) => apiRequest(`/products/${encodeURIComponent(slug)}`);

export { getProductBySlug, getProducts };