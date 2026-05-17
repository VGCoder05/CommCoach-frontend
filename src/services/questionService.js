import api from './api';

// Get all questions
export const getQuestions = async (filters = {}, token) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/questions?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get single question
export const getQuestion = async (id, token) => {
  const response = await api.get(`/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get suggestions
export const getSuggestions = async (token) => {
  const response = await api.get('/questions/suggestions', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get question of the day
export const getQuestionOfTheDay = async (token) => {
  const response = await api.get('/questions/daily', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get categories
export const getCategories = async (token) => {
  const response = await api.get('/questions/meta/categories', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create custom question
export const createQuestion = async (questionData, token) => {
  const response = await api.post('/questions', questionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};