import { apiRequest } from './apiClient.js';

const getDashboard = () => apiRequest('/admin/dashboard');

export { getDashboard };