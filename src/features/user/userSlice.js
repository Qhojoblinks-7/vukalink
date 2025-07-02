// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService'; // Reusing your existing userService

const initialState = {
  // State for the authenticated user's profile (can be merged with auth.user if desired, but often kept separate for full profile details)
  currentUserProfile: null,
  currentUserProfileStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  currentUserProfileError: null,

  // State for viewing another user's public profile
  publicProfile: null,
  publicProfileStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  publicProfileError: null,

  // General action status for updates (e.g., updating profile)
  updateStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  updateError: null,
};

// --- Async Thunks ---

// Thunk to fetch the authenticated user's own profile
export const fetchCurrentUserProfile = createAsyncThunk(
  'user/fetchCurrentUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // Pass userId if your API requires it, otherwise backend should identify user by token
      const response = await userService.getUserProfile(userId); // Assuming /users/:userId/profile
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to update the authenticated user's own profile
export const updateCurrentUserProfile = createAsyncThunk(
  'user/updateCurrentUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(userId, profileData); // Assuming /users/:userId/profile
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to fetch another user's public profile
export const fetchPublicProfile = createAsyncThunk(
  'user/fetchPublicProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile(userId); // Reusing getUserProfile for public profiles
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// --- User Slice ---
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous reducers for local state updates or clearing
    clearCurrentUserProfile: (state) => {
      state.currentUserProfile = null;
      state.currentUserProfileStatus = 'idle';
      state.currentUserProfileError = null;
    },
    clearPublicProfile: (state) => {
      state.publicProfile = null;
      state.publicProfileStatus = 'idle';
      state.publicProfileError = null;
    },
    clearUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchCurrentUserProfile ---
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.currentUserProfileStatus = 'loading';
        state.currentUserProfileError = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.currentUserProfileStatus = 'succeeded';
        state.currentUserProfile = action.payload;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.currentUserProfileStatus = 'failed';
        state.currentUserProfileError = action.payload || 'Failed to fetch user profile';
        state.currentUserProfile = null;
      })
      // --- updateCurrentUserProfile ---
      .addCase(updateCurrentUserProfile.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.currentUserProfile = action.payload; // Update the profile with the returned data
      })
      .addCase(updateCurrentUserProfile.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || 'Failed to update user profile';
      })
      // --- fetchPublicProfile ---
      .addCase(fetchPublicProfile.pending, (state) => {
        state.publicProfileStatus = 'loading';
        state.publicProfileError = null;
        state.publicProfile = null; // Clear previous public profile data
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.publicProfileStatus = 'succeeded';
        state.publicProfile = action.payload;
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.publicProfileStatus = 'failed';
        state.publicProfileError = action.payload || 'Failed to fetch public profile';
        state.publicProfile = null;
      });
  },
});

export const {
  clearCurrentUserProfile,
  clearPublicProfile,
  clearUpdateStatus,
} = userSlice.actions;

export default userSlice.reducer;