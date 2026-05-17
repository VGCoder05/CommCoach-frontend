import api from './api';

// Get overview
export const getOverview = async (token) => {
  const response = await api.get('/progress/overview', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get trends
export const getTrends = async (days = 30, token) => {
  const response = await api.get(`/progress/trends?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get calendar
export const getCalendar = async (year, token) => {
  const response = await api.get(`/progress/calendar?year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get stats
export const getStats = async (token) => {
  const response = await api.get('/progress/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get needs work
export const getNeedsWork = async (token) => {
  const response = await api.get('/progress/needs-work', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};