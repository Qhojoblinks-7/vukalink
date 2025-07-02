// src/features/company/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from '../../services/opportunityService'; // Reusing opportunityService for company-related opportunity actions
// import companyService from '../../services/companyService'; // Uncomment and create if you have dedicated company profile/dashboard endpoints

const initialState = {
  dashboardData: null, // For company dashboard overview
  postedOpportunities: [], // List of opportunities posted by the company
  currentManagedOpportunity: null, // For editing/viewing details of a specific company opportunity
  applicantsForOpportunity: [], // List of applicants for a specific opportunity
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  // Additional states for forms, pagination, etc., can be added here
  postOpportunityStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' for post/edit actions
  postOpportunityError: null,
};

// Async Thunks

// Thunk to fetch company dashboard summary data
// Assuming an endpoint like /companies/me/dashboard or /dashboard based on role
export const fetchCompanyDashboardData = createAsyncThunk(
  'company/fetchCompanyDashboardData',
  async (companyId, { rejectWithValue }) => {
    try {
      // If you have a specific company service for this:
      // const response = await companyService.getCompanyDashboard(companyId);
      // For now, let's assume it's just a general dashboard endpoint that relies on the token
      const response = await opportunityService.getCompanyOpportunities(companyId); // This might fetch opportunities, but a real dashboard would be more comprehensive
                                                                               // You'd need a specific endpoint for dashboard stats.
      // Mocking dashboard data for demonstration
      const mockDashboardData = {
        totalOpportunities: response.length, // Example: count of opportunities
        totalApplicants: response.reduce((acc, opp) => acc + (opp.applicants ? opp.applicants.length : 0), 0),
        activeOpportunities: response.filter(opp => new Date(opp.applicationDeadline) > new Date()).length,
        pendingApplications: 5, // Placeholder
        messages: 2, // Placeholder
      };
      return mockDashboardData; // Return aggregated data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Thunk to fetch all opportunities posted by the company
export const fetchCompanyOpportunities = createAsyncThunk(
  'company/fetchCompanyOpportunities',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getCompanyOpportunities(companyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to post a new opportunity
export const postNewOpportunity = createAsyncThunk(
  'company/postNewOpportunity',
  async (opportunityData, { rejectWithValue }) => {
    try {
      const response = await opportunityService.postOpportunity(opportunityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to update an existing opportunity
export const updateCompanyOpportunity = createAsyncThunk(
  'company/updateCompanyOpportunity',
  async ({ id, opportunityData }, { rejectWithValue }) => {
    try {
      const response = await opportunityService.updateOpportunity(id, opportunityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to delete an opportunity
export const deleteCompanyOpportunity = createAsyncThunk(
  'company/deleteCompanyOpportunity',
  async (id, { rejectWithValue }) => {
    try {
      await opportunityService.deleteOpportunity(id);
      return id; // Return the ID of the deleted opportunity
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to fetch applicants for a specific opportunity
export const fetchApplicantsForOpportunity = createAsyncThunk(
  'company/fetchApplicantsForOpportunity',
  async (opportunityId, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getApplicantsForOpportunity(opportunityId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // Synchronous reducers go here if needed
    clearCompanyError: (state) => {
      state.error = null;
      state.postOpportunityError = null;
    },
    clearApplicants: (state) => {
      state.applicantsForOpportunity = [];
    },
    setCurrentManagedOpportunity: (state, action) => {
      state.currentManagedOpportunity = action.payload; // Set a specific opportunity for viewing/editing
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Company Dashboard Data
      .addCase(fetchCompanyDashboardData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCompanyDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboardData = action.payload;
      })
      .addCase(fetchCompanyDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch company dashboard data';
      })
      // Fetch Company Opportunities
      .addCase(fetchCompanyOpportunities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCompanyOpportunities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postedOpportunities = action.payload;
      })
      .addCase(fetchCompanyOpportunities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch company opportunities';
        state.postedOpportunities = [];
      })
      // Post New Opportunity
      .addCase(postNewOpportunity.pending, (state) => {
        state.postOpportunityStatus = 'loading';
        state.postOpportunityError = null;
      })
      .addCase(postNewOpportunity.fulfilled, (state, action) => {
        state.postOpportunityStatus = 'succeeded';
        state.postedOpportunities.push(action.payload); // Add the new opportunity to the list
      })
      .addCase(postNewOpportunity.rejected, (state, action) => {
        state.postOpportunityStatus = 'failed';
        state.postOpportunityError = action.payload || 'Failed to post opportunity';
      })
      // Update Company Opportunity
      .addCase(updateCompanyOpportunity.pending, (state) => {
        state.postOpportunityStatus = 'loading';
        state.postOpportunityError = null;
      })
      .addCase(updateCompanyOpportunity.fulfilled, (state, action) => {
        state.postOpportunityStatus = 'succeeded';
        const index = state.postedOpportunities.findIndex(opp => opp.id === action.payload.id);
        if (index !== -1) {
          state.postedOpportunities[index] = action.payload; // Update the opportunity in the list
        }
        if (state.currentManagedOpportunity && state.currentManagedOpportunity.id === action.payload.id) {
          state.currentManagedOpportunity = action.payload; // Update current managed if it's the one
        }
      })
      .addCase(updateCompanyOpportunity.rejected, (state, action) => {
        state.postOpportunityStatus = 'failed';
        state.postOpportunityError = action.payload || 'Failed to update opportunity';
      })
      // Delete Company Opportunity
      .addCase(deleteCompanyOpportunity.pending, (state) => {
        state.status = 'loading'; // Could use a specific status for delete
        state.error = null;
      })
      .addCase(deleteCompanyOpportunity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postedOpportunities = state.postedOpportunities.filter(
          (opp) => opp.id !== action.payload // Filter out the deleted opportunity
        );
        state.currentManagedOpportunity = null; // Clear if the deleted one was being managed
      })
      .addCase(deleteCompanyOpportunity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete opportunity';
      })
      // Fetch Applicants For Opportunity
      .addCase(fetchApplicantsForOpportunity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.applicantsForOpportunity = [];
      })
      .addCase(fetchApplicantsForOpportunity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applicantsForOpportunity = action.payload;
      })
      .addCase(fetchApplicantsForOpportunity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch applicants';
        state.applicantsForOpportunity = [];
      });
  },
});

export const { clearCompanyError, clearApplicants, setCurrentManagedOpportunity } = companySlice.actions;

export default companySlice.reducer;