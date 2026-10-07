import { apiRequest } from './apiClient.js';

const getCategories = () => apiRequest('/categories');

export { getCategories };
