import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as questionService from '../../services/questionService';

const initialState = {
  questions: [],
  currentQuestion: null,
  suggestions: [],
  questionOfTheDay: null,
  categories: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get all questions
export const getQuestions = createAsyncThunk(
  'questions/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.getQuestions(filters, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single question
export const getQuestion = createAsyncThunk(
  'questions/getOne',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.getQuestion(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get smart suggestions
export const getSuggestions = createAsyncThunk(
  'questions/suggestions',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.getSuggestions(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get question of the day
export const getQuestionOfTheDay = createAsyncThunk(
  'questions/daily',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.getQuestionOfTheDay(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  'questions/categories',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.getCategories(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create custom question
export const createQuestion = createAsyncThunk(
  'questions/create',
  async (questionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await questionService.createQuestion(questionData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all questions
      .addCase(getQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload.questions;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single question
      .addCase(getQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestion = action.payload.question;
      })
      .addCase(getQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get suggestions
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions;
      })
      // Get question of the day
      .addCase(getQuestionOfTheDay.fulfilled, (state, action) => {
        state.questionOfTheDay = action.payload.question;
      })
      // Get categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      // Create question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload.question);
      });
  },
});

export const { reset, clearCurrentQuestion } = questionSlice.actions;
export default questionSlice.reducer;