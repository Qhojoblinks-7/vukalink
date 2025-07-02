// src/features/savedOpportunities/savedOpportunitiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from '../../services/opportunityService';

const initialState = {
  savedOpportunities: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchSavedOpportunities = createAsyncThunk(
  'savedOpportunities/fetchSavedOpportunities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await opportunityService.getSavedOpportunities();
      return data; // Assuming data is an array of opportunities
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleSaveOpportunity = createAsyncThunk(
  'savedOpportunities/toggleSaveOpportunity',
  async ({ opportunityId, isCurrentlySaved }, { rejectWithValue }) => {
    try {
      if (isCurrentlySaved) {
        await opportunityService.unsaveOpportunity(opportunityId);
        return { opportunityId, action: 'unsaved' };
      } else {
        await opportunityService.saveOpportunity(opportunityId);
        return { opportunityId, action: 'saved' };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const savedOpportunitiesSlice = createSlice({
  name: 'savedOpportunities',
  initialState,
  reducers: {
    // Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch Saved Opportunities
      .addCase(fetchSavedOpportunities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSavedOpportunities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedOpportunities = action.payload;
      })
      .addCase(fetchSavedOpportunities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch saved opportunities';
        state.savedOpportunities = [];
      })
      // Toggle Save Opportunity
      .addCase(toggleSaveOpportunity.fulfilled, (state, action) => {
        const { opportunityId, action: toggleAction } = action.payload;
        if (toggleAction === 'saved') {
          // If the opportunity details are not in the payload, you might need to re-fetch or add a placeholder
          // For now, let's assume successful save implies it should be added if not present (or refetching is done later)
          // Ideally, the service call would return the full opportunity object when saving.
          // For simplicity, we might just re-fetch the entire saved list after toggling.
          // Or, update based on the assumption that `action.payload.opportunity` contains the new saved item:
          // state.savedOpportunities.push(action.payload.opportunity); // If API returns the saved item
        } else { // 'unsaved'
          state.savedOpportunities = state.savedOpportunities.filter(
            (opp) => opp.id !== opportunityId
          );
        }
        // No change to status for this particular action, assuming it's quick
      })
      .addCase(toggleSaveOpportunity.rejected, (state, action) => {
        // Handle error for saving/unsaving
        state.error = action.payload || 'Failed to update saved status';
      });
  },
});

export default savedOpportunitiesSlice.reducer;