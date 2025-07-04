// src/features/resources/resourcesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resourceService from '../../services/resourceService';
import { DUMMY_ARTICLES } from '../../utils/constants';

const initialState = {
  articles: DUMMY_ARTICLES,
  currentArticle: null,
  status: 'idle',
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
      const response = await resourceService.getResources(params);
      console.log("Response from resourceService.getResources:", response); // Log the full response
      console.log("response.data:", response.data); // Log what 'response.data' is

      // Ensure that 'response.data' is an array.
      // If your API returns the array directly (e.g., just `[{}, {}]`),
      // you might need to return `response` instead of `response.data`.
      // Or if the array is nested differently (e.g., `response.articles`), adjust accordingly.
      if (!Array.isArray(response.data)) {
        console.warn("API response.data is not an array:", response.data);
        // You might want to return an empty array here or throw an error
        return []; // Return an empty array to prevent issues downstream
      }

      return response.data; // This needs to be the actual array of articles
    } catch (error) {
      console.error("Error in fetchArticles thunk:", error); // Log the error for debugging
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'resources/fetchArticleById',
  async (id, { rejectWithValue }) => {
    try {
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
        console.log("fetchArticles.fulfilled payload:", action.payload); // Log the payload reaching the reducer
        state.articles = action.payload; // This must be an array
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch articles';
        state.articles = []; // Good: ensures articles is an empty array on failure
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