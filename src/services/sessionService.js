import api from './api';

// Start new session
export const startSession = async (questionId, token) => {
  try {
    const response = await api.post(
      '/sessions/start',
      { questionId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw error.response?.data || new Error('Failed to start session.');
  }
};

// Submit answer
export const submitAnswer = async (sessionId, rawAnswer, token) => {
  try {
    const response = await api.post(
      `/sessions/${sessionId}/submit`,
      { rawAnswer },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error.response?.data || new Error('Failed to submit answer.');
  }
};

// Complete session
export const completeSession = async (sessionId, token) => {
  try {
    const response = await api.patch(
      `/sessions/${sessionId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error completing session:', error);
    throw error.response?.data || new Error('Failed to complete session.');
  }
};

// Get history
export const getHistory = async (params = {}, token) => {
  try {
    const queryString = new URLSearchParams(params).toString();

    const response = await api.get(
      `/sessions/history?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error.response?.data || new Error('Failed to fetch history.');
  }
};

// Get single session
export const getSession = async (sessionId, token) => {
  try {
    const response = await api.get(
      `/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error.response?.data || new Error('Failed to fetch session.');
  }
};