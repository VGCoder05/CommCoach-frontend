import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as progressService from '../../services/progressService';

const initialState = {
  overview: null,
  trends: [],
  calendar: [],
  stats: null,
  needsWork: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get overview
export const getOverview = createAsyncThunk(
  'progress/overview',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await progressService.getOverview(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get trends
export const getTrends = createAsyncThunk(
  'progress/trends',
  async (days, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await progressService.getTrends(days, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get calendar
export const getCalendar = createAsyncThunk(
  'progress/calendar',
  async (year, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await progressService.getCalendar(year, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get stats
export const getStats = createAsyncThunk(
  'progress/stats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await progressService.getStats(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get needs work
export const getNeedsWork = createAsyncThunk(
  'progress/needsWork',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await progressService.getNeedsWork(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get overview
      .addCase(getOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload.overview;
      })
      .addCase(getOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get trends
      .addCase(getTrends.fulfilled, (state, action) => {
        state.trends = action.payload.trends;
      })
      // Get calendar
      .addCase(getCalendar.fulfilled, (state, action) => {
        state.calendar = action.payload.calendar;
      })
      // Get stats
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })
      // Get needs work
      .addCase(getNeedsWork.fulfilled, (state, action) => {
        state.needsWork = action.payload.questions;
      });
  },
});

export const { reset } = progressSlice.actions;
export default progressSlice.reducer;