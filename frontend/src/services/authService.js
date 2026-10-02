import { apiRequest } from './apiClient.js';

const register = (credentials) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: credentials
  });

const login = (credentials) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  });

const getCurrentUser = () => apiRequest('/auth/me');

export { getCurrentUser, login, register };