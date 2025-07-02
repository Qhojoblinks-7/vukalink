// src/features/resources/resourcesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resourceService from '../../services/resourceService'; // Assuming you have a resourceService for API calls
import { DUMMY_ARTICLES } from '../../utils/constants'; // Using dummy for now, but will come from API

const initialState = {
  articles: DUMMY_ARTICLES, // Initialize with dummy data if needed for development
  currentArticle: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    category: 'All Articles',
    searchTerm: '',
    sortBy: 'Newest',
  },
};

export const fetchArticles = createAsyncThunk(
  'resources/fetchArticles',
  async (params, { rejectWithValue }) => {
    try {
      // Use resourceService to fetch articles from API
      const response = await resourceService.getResources(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'resources/fetchArticleById',
  async (id, { rejectWithValue }) => {
    try {
      // Use resourceService to fetch article by ID from API
      const response = await resourceService.getResourceById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResourceFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch articles';
        state.articles = [];
      })
      // Fetch Article By ID
      .addCase(fetchArticleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentArticle = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch article details';
        state.currentArticle = null;
      });
  },
});

export const { setResourceFilters, clearCurrentArticle } = resourcesSlice.actions;
export default resourcesSlice.reducer;