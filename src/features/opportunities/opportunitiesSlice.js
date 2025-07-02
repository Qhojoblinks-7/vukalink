// src/features/opportunities/opportunitiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from '../../services/opportunityService';

const initialState = {
  opportunities: [],
  currentOpportunity: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {}, // Store current filters for opportunities list
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOpportunities: 0,
    opportunitiesPerPage: 10,
  },
};

export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getOpportunities(params);
      return response.data; // Assuming API returns { opportunities, totalPages, currentPage, total }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'opportunities/fetchOpportunityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getOpportunityById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const applyForOpportunity = createAsyncThunk(
  'opportunities/applyForOpportunity',
  async ({ opportunityId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await opportunityService.applyForOpportunity(opportunityId, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setOpportunityFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1; // Reset to first page on filter change
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Opportunities
      .addCase(fetchOpportunities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.opportunities = action.payload.opportunities;
        state.pagination.totalOpportunities = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch opportunities';
        state.opportunities = [];
      })
      // Fetch Opportunity By ID
      .addCase(fetchOpportunityById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentOpportunity = null;
      })
      .addCase(fetchOpportunityById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOpportunity = action.payload;
      })
      .addCase(fetchOpportunityById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch opportunity details';
        state.currentOpportunity = null;
      })
      // Apply For Opportunity
      .addCase(applyForOpportunity.pending, (state) => {
        state.status = 'loading'; // Could use a separate status for apply
        state.error = null;
      })
      .addCase(applyForOpportunity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally update the opportunity to reflect user applied
        // state.currentOpportunity.hasApplied = true;
      })
      .addCase(applyForOpportunity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to apply for opportunity';
      });
  },
});

export const { setOpportunityFilters, setCurrentPage } = opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;