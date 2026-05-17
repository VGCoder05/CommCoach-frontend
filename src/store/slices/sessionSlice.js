import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as sessionService from '../../services/sessionService';

const initialState = {
  currentSession: null,
  sessions: [],
  diagnosis: null,
  isLoading: false,
  isDiagnosing: false,
  isError: false,
  message: '',
};

// Start new session
export const startSession = createAsyncThunk(
  'session/start',
  async (questionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await sessionService.startSession(questionId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit answer
export const submitAnswer = createAsyncThunk(
  'session/submit',
  async ({ sessionId, rawAnswer }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await sessionService.submitAnswer(sessionId, rawAnswer, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Complete session
export const completeSession = createAsyncThunk(
  'session/complete',
  async (sessionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await sessionService.completeSession(sessionId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get session history
export const getHistory = createAsyncThunk(
  'session/history',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await sessionService.getHistory(params, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single session
export const getSession = createAsyncThunk(
  'session/getOne',
  async (sessionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await sessionService.getSession(sessionId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isDiagnosing = false;
      state.isError = false;
      state.message = '';
    },
    clearSession: (state) => {
      state.currentSession = null;
      state.diagnosis = null;
    },
    clearDiagnosis: (state) => {
      state.diagnosis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start session
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload.session;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Submit answer
      .addCase(submitAnswer.pending, (state) => {
        state.isDiagnosing = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.isDiagnosing = false;
        state.diagnosis = action.payload.attempt;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isDiagnosing = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Complete session
      .addCase(completeSession.fulfilled, (state, action) => {
        state.currentSession = action.payload.session;
      })
      // Get history
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload.sessions;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get session
      .addCase(getSession.fulfilled, (state, action) => {
        state.currentSession = action.payload.session;
      });
  },
});

export const { reset, clearSession, clearDiagnosis } = sessionSlice.actions;
export default sessionSlice.reducer;