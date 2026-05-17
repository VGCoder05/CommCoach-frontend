import api from './api';

// Start new session
export const startSession = async (questionId, token) => {
  const response = await api.post(
    '/sessions/start',
    { questionId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Submit answer
export const submitAnswer = async (sessionId, rawAnswer, token) => {
  const response = await api.post(
    `/sessions/${sessionId}/submit`,
    { rawAnswer },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Complete session
export const completeSession = async (sessionId, token) => {
  const response = await api.patch(
    `/sessions/${sessionId}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get history
export const getHistory = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/sessions/history?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get single session
export const getSession = async (sessionId, token) => {
  const response = await api.get(`/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};