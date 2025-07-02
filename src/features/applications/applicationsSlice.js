import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient'; // Make sure this path is correct

// Async thunk to fetch applications
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (studentId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          application_date,
          status,
          last_status_update,
          internships (
            title,
            profiles (
              company_name,
              company_logo_url
            )
          )
        `)
        .eq('student_id', studentId);

      if (error) {
        throw error;
      }

      const formattedApplications = data.map(app => ({
        id: app.id,
        jobTitle: app.internships.title,
        company: app.internships.profiles.company_name,
        companyLogo: app.internships.profiles.company_logo_url,
        dateApplied: app.application_date,
        currentStatus: app.status === 'pending' ? 'Applied' : (app.status === 'accepted' ? 'Offer' : app.status),
        lastStatusUpdate: app.last_status_update,
      }));

      return formattedApplications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to withdraw an application (single or bulk)
export const withdrawApplications = createAsyncThunk(
  'applications/withdrawApplications',
  async (applicationIds, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn', last_status_update: new Date().toISOString() })
        .in('id', applicationIds); // Update applications by their IDs

      if (error) {
        throw error;
      }

      return applicationIds; // Return the IDs of withdrawn applications
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Other synchronous reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(withdrawApplications.pending, (state) => {
        state.status = 'loading'; // Or a separate status for withdrawal
      })
      .addCase(withdrawApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove or update the withdrawn applications in the state
        const withdrawnIds = action.payload;
        state.list = state.list.filter(app => !withdrawnIds.includes(app.id)); // Remove from list
        // Or, if keeping them, update their status:
        // state.list = state.list.map(app =>
        //   withdrawnIds.includes(app.id) ? { ...app, currentStatus: 'Withdrawn' } : app
        // );
      })
      .addCase(withdrawApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default applicationsSlice.reducer;