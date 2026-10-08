import { apiRequest } from './apiClient.js';

const getCategories = () => apiRequest('/categories');

const createCategory = (category) =>
  apiRequest('/categories', {
    method: 'POST',
    body: category
  });

const updateCategory = (id, category) =>
  apiRequest(`/categories/${id}`, {
    method: 'PATCH',
    body: category
  });

const deleteCategory = (id) =>
  apiRequest(`/categories/${id}`, {
    method: 'DELETE'
  });

export {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
};
