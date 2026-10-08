import { apiRequest } from './apiClient.js';

const getProducts = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
};

const getProductBySlug = (slug) =>
  apiRequest(`/products/${encodeURIComponent(slug)}`);

const createProduct = (product) =>
  apiRequest('/products', {
    method: 'POST',
    body: product
  });

const updateProduct = (id, product) =>
  apiRequest(`/products/${id}`, {
    method: 'PATCH',
    body: product
  });

const deleteProduct = (id) =>
  apiRequest(`/products/${id}`, {
    method: 'DELETE'
  });

export {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct
};
