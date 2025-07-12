// src/features/opportunities/opportunitiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from '../../services/opportunityService';

const initialState = {
  opportunities: [], // This will now hold the student's applications
  currentOpportunity: null, // For general opportunity details (e.g., job listing details)
  currentApplication: null, // <-- NEW: For individual application details view (e.g., in My Applications)
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    status: 'All', // Default filter status
    sortBy: 'Date Applied', // Default sort order
    searchTerm: '', // Default search term
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOpportunities: 0,
    opportunitiesPerPage: 5, // Matching the design screenshot (Showing 1-5 of 12 applications)
  },
};

// This thunk will be specifically for fetching applications for the logged-in student.
export const fetchStudentApplications = createAsyncThunk(
  'opportunities/fetchStudentApplications',
  async ({ userId, filters, page, limit }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required to fetch applications.");
      }
      const response = await opportunityService.getStudentApplications(userId);

      console.log("API Response (student applications):", response);
      return response; // `opportunityService.getStudentApplications` returns an array of applications
    } catch (error) {
      console.error("Error fetching student applications:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// If `fetchOpportunities` is still needed for a general list of all available opportunities,
// it should be kept separate and manage its own state part or be refactored.
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getOpportunities(params);
      console.log("API Response (general opportunities):", response);
      return response;
    } catch (error) {
      console.error("Error fetching opportunities (general):", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'opportunities/fetchOpportunityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await opportunityService.getOpportunityById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// <-- NEW THUNK: For fetching a single application by ID -->
export const fetchApplicationById = createAsyncThunk(
    'opportunities/fetchApplicationById', // Use a clear action type
    async (applicationId, { rejectWithValue }) => {
        try {
            const application = await opportunityService.getApplicationById(applicationId);
            if (!application) {
                // Return null or throw an error if not found. Throwing makes it go to rejected.
                return rejectWithValue('Application not found');
            }
            return application;
        } catch (error) {
            console.error("Error fetching application by ID:", error.message);
            return rejectWithValue(error.message || 'Failed to fetch application details');
        }
    }
);


export const applyForOpportunity = createAsyncThunk(
  'opportunities/applyForOpportunity',
  async ({ studentId, opportunityId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await opportunityService.applyForOpportunity(studentId, opportunityId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message); // Service throws direct error message
    }
  }
);

// Thunk for updating a single application status (e.g., for withdrawing a single application)
export const updateApplicationStatus = createAsyncThunk(
  'opportunities/updateApplicationStatus',
  async ({ applicationId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await opportunityService.updateApplicationStatus(applicationId, newStatus);
      return response;
    } catch (error) {
      console.error("Error updating application status:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk for bulk updating application statuses (e.g., for bulk withdraw)
export const bulkUpdateApplicationStatus = createAsyncThunk(
    'opportunities/bulkUpdateApplicationStatus',
    async ({ applicationIds, newStatus }, { rejectWithValue }) => {
        try {
            const response = await opportunityService.bulkUpdateApplicationStatus(applicationIds, newStatus);
            // The response here might be the count of updated records or an array of updated records.
            // For simplicity, we'll assume the service returns success/failure or the updated count.
            return response;
        } catch (error) {
            console.error("Error bulk updating application status:", error.message);
            return rejectWithValue(error.message || 'Failed to bulk update application statuses');
        }
    }
);

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setOpportunityFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }; // Merge existing filters
      state.pagination.currentPage = 1; // Reset to first page on filter change
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    // <-- NEW REDUCER: To clear individual application details when component unmounts -->
    clearCurrentApplication: (state) => {
        state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch General Opportunities (if still needed for other parts of app)
      .addCase(fetchOpportunities.pending, (state) => {
        // Handle pending for general opportunities if they use 'status' too,
        // or add a separate status field for them.
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        // Logic for general opportunities (e.g., populating a different state field)
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        // Logic for general opportunities
      })

      // Handle Fetch Student Applications (for My Applications Page)
      .addCase(fetchStudentApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.opportunities = action.payload; // action.payload is the array of student applications

        // Calculate pagination details client-side based on ALL fetched applications
        state.pagination.totalOpportunities = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.opportunitiesPerPage) || 1;
        state.pagination.currentPage = 1; // Reset to first page after fresh fetch
      })
      .addCase(fetchStudentApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch student applications';
        state.opportunities = []; // Clear applications on failure
      })

      // Fetch Opportunity By ID (for general job details page)
      .addCase(fetchOpportunityById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentOpportunity = null; // Clear previous opportunity details
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

      // <-- NEW: Handle Fetch Application By ID (for My Applications Details Page) -->
      .addCase(fetchApplicationById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentApplication = null; // Clear previous application details
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not load application details.';
        state.currentApplication = null;
      })

      // Apply For Opportunity
      .addCase(applyForOpportunity.pending, (state) => {
        state.status = 'loading'; // Consider a more specific status if needed, e.g., 'applying'
        state.error = null;
      })
      .addCase(applyForOpportunity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // After applying, you might want to re-fetch student applications to update the list,
        // or add the new application to the `opportunities` array if the payload contains it.
      })
      .addCase(applyForOpportunity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to apply for opportunity';
      })

      // Update Application Status (for single withdraw)
      .addCase(updateApplicationStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedApplication = action.payload;
        // Find and update the specific application in the state.opportunities array
        const index = state.opportunities.findIndex(app => app.id === updatedApplication.id);
        if (index !== -1) {
            state.opportunities[index] = updatedApplication;
        }
        // If the currentApplication being viewed is the one updated, update it too
        if (state.currentApplication && state.currentApplication.id === updatedApplication.id) {
            state.currentApplication = updatedApplication;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update application status';
      })

      // Bulk Update Application Status
      .addCase(bulkUpdateApplicationStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(bulkUpdateApplicationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The action.payload might contain the IDs of updated applications or the updated records.
        // For simplicity, we re-fetch the entire list of applications in MyApplicationsPage after bulk update,
        // so we don't need complex in-slice updates here.
      })
      .addCase(bulkUpdateApplicationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to bulk update application statuses';
      });
  },
});

export const { setOpportunityFilters, setCurrentPage, clearCurrentApplication } = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;