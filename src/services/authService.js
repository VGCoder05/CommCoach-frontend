import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Get current user
export const getMe = async (token) => {
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};